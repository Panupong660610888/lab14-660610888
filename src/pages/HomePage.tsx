import { useState } from "react";
import ModalRegister from "../components/ModalRegister";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="col-12 mt-4 p-0">
      <div className="container text-center">
        <h2> Wellcome To CMU Marathon</h2>
        <div>
          <img src="/marathonrun.png" alt="Logo CMU Marathon" />
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Register
        </button>
        {showModal && <ModalRegister onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
}
