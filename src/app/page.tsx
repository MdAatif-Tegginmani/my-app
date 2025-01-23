"use client";
import DynamicTable from "./components/DynamicTable";
import Summary from "./components/Summary";
import Calendar from "./components/Calendar";

export default function HomePage() {
  return (
    <div className="p-4 md:p-6 mobile:p-2 ">
      {/* Responsive grid for Calendar and Table */}
      <div className="grid grid-cols-1 md:grid-cols-[500px_1fr]   gap-6">
        {/* Calendar Section */}
        <div className="bg-white rounded-lg p-4 md:p-6   shadow-sm">
          <Calendar />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm w-full overflow-auto">
          <DynamicTable />
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 md:mt-12 mobile:mt-6 max-w-full md:max-w-3xl">
        <Summary />
      </div>
    </div>
  );
}
