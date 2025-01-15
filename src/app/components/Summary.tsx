import React, { useState } from "react";

const Summary = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("Today");

  const handleTimeFrameChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTimeFrame(event.target.value);
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl text-[#622BD9] opacity-80 font-semibold mb-4">Summary</h2>
        <div className="flex justify-between items-center">
          <select
            value={selectedTimeFrame}
            onChange={handleTimeFrameChange}
            className="mb-4 w-1/4 p-2 border rounded"
          >
            <option value="Today">Today</option>
            <option value="Month till date">Month till date</option>
            <option value="Year till date">Year till date</option>
            <option value="Lifetime">Lifetime</option>
          </select>
          <div className="flex justify-between items-centerjustify-between items-center">
            <div className="mr-10">
              <div className=" border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm text-gray-500">Money In</h3>
                <p className="text-lg font-semibold text-purple-500">$2.4k</p>
              </div>
              <div className=" border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm text-gray-500">Money Out</h3>
                <p className="text-lg font-semibold text-purple-500">$2.4k</p>
              </div>
            </div>
              <div className=" border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm text-gray-500">Current Balance</h3>
                <p className="text-lg font-semibold text-purple-500">
                  $12,574.43
                </p>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
