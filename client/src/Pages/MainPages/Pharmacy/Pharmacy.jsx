import PharmacyInventory from "./components/PharmacyInventory";
import PharmacyQueue from "./components/PharmacyQueue";

function Pharmacy() {
  return (
    <div className="space-y-8">
      <PharmacyQueue />
      <PharmacyInventory />
    </div>
  );
}

export default Pharmacy;