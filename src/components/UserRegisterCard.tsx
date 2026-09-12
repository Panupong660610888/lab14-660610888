import type { Registrant } from "../libs/Registrant";

export default function UserRegisterCard({
  registrant,
}: {
  registrant: Registrant;
}) {
  const genderIcon = registrant.gender === "male" ? "👨 Male" : "👩 Female";

  const extraItems = [
    { id: "bottle", label: "Bottle 🍼" },
    { id: "shoes", label: "Shoes 👟" },
    { id: "cap", label: "Cap 🧢" },
  ];

  return (
    <div className="card p-3 mb-3">
      <h5>{registrant.fullName}</h5>

      <div>
        {registrant.plan}·{genderIcon}
      </div>

      <div>
        {registrant.extras.map((id) => {
          const item = extraItems.find((item) => item.id === id);

          return (
            <button key={id} className="btn btn-light btn-sm me-2">
              {item?.label}
            </button>
          );
        })}
      </div>

      <div>{registrant.total.toLocaleString()} THB</div>
    </div>
  );
}
