import { useState } from "react";
import type { Registrant } from "../libs/Registrant";

type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
};

//---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];
// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

const STORAGE_KEY = "marathon.registrants";

function loadReg(): Registrant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ModalRegister({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<RegisterForm>({
    fname: "",
    lname: "",
    plan: "",
    gender: "",
  });

  const [agree, setAgree] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
  });

  const updateForm = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };
  const computeTotalPayment = () => {
    let total = 0;
    const selectedPlan = plans.find((p) => p.id === form.plan);
    if (selectedPlan) {
      total += selectedPlan.price;
    }
    selectedExtras.forEach((id) => {
      const item = extraItems.find((item) => item.id === id);
      if (item) {
        total += item.price;
      }
    });
    if (selectedExtras.length === 3) {
      total = total * 0.8;
    }
    return total;
  };

  const registerBtnOnClick = () => {
    const newErrors = {
      fname: form.fname === "",
      lname: form.lname === "",
      plan: form.plan === "",
      gender: form.gender === "",
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((isError) => isError);
    if (hasError) return;

    const total = computeTotalPayment();

    const registrant: Registrant = {
      id: Date.now(),
      fullName: form.fname + " " + form.lname,
      gender: form.gender,
      plan: plans.find((p) => p.id === form.plan)?.label || "",
      total: total,
      extras: selectedExtras,
    };

    const registrants = loadReg();

    registrants.push(registrant);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrants));

    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`,
    );

    onClose();
  };

  return (
    <div
      className="modal fade show d-block"
      id="modalregister"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="modalregisterLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content text-start">
          <div className="modal-header">
            <h5 className="modal-title">Register CMU Marathon 🏃‍♂️</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-flex gap-2">
              <div>
                <label className="form-label">First name</label>
                <input
                  className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                  onChange={(e) => updateForm("fname", e.target.value)}
                  value={form.fname}
                />

                <div className="invalid-feedback">Invalid first name</div>
              </div>
              <div>
                <label className="form-label">Last name</label>
                <input
                  className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                  value={form.lname}
                  onChange={(e) => updateForm("lname", e.target.value)}
                />
                <div className="invalid-feedback">Invalid last name</div>
              </div>
            </div>
            <div className="mt-2">
              <label className="form-label">Plan</label>

              <select
                className={`form-select ${errors.plan ? "is-invalid" : ""}`}
                value={form.plan}
                onChange={(e) => updateForm("plan", e.target.value)}
              >
                <option value="">Please select..</option>

                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.price.toLocaleString()} THB)
                  </option>
                ))}
              </select>

              <div className="invalid-feedback">Please select a Plan</div>
            </div>
            <div className="mt-2">
              <label className="form-label">Gender</label>
              <div>
                <input
                  className="me-2 form-check-input"
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={(e) => updateForm("gender", e.target.value)}
                />
                Male 👨
                <input
                  className="mx-2 form-check-input"
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={(e) => updateForm("gender", e.target.value)}
                />
                Female 👩
              </div>
              {errors.gender && (
                <div className="text-danger">Please select gender</div>
              )}
            </div>
            {/* Extra Items */}
            <div>
              <label className="form-label">Extra Item(s)</label>
              <div>
                {extraItems.map((item) => (
                  <div key={item.id}>
                    <input
                      className="me-2 form-check-input"
                      type="checkbox"
                      checked={selectedExtras.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedExtras([...selectedExtras, item.id]);
                        } else {
                          setSelectedExtras(
                            selectedExtras.filter((id) => id !== item.id),
                          );
                        }
                      }}
                    />

                    <label className="form-check-label">
                      {item.label} ({item.price} THB)
                    </label>
                  </div>
                ))}
              </div>
              {/* conditional เมื่อเลือกสินค้าเสริมทั้งหมด ให้แสดง discount*/}
              {selectedExtras.length === 3 && (
                <span className="text-success d-block">(20% Discounted)</span>
              )}
            </div>
            <div className="alert alert-primary mt-3" role="alert">
              Promotion📢 Buy all items to get 20% Discount
            </div>
            <div>
              Total Payment : {computeTotalPayment().toLocaleString()} THB
            </div>
          </div>

          <div className="modal-footer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />{" "}
            I agree to the terms and conditions
            <button
              className="btn btn-success my-2"
              onClick={registerBtnOnClick}
              disabled={!agree}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      {/* <div className="modal-backdrop fade show"></div> */}
    </div>
  );
}
