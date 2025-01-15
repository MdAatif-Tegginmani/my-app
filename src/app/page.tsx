"use client";
import DynamicTable from "./components/DynamicTable";
import Summary from "./components/Summary";
import Calendar from "./components/Calendar";

export default function HomePage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-[500px_1fr] gap-6 ">
    
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Calendar />
        </div>

        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <DynamicTable />
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
          <Summary />
        </div>



        
    </div>
  );
}
