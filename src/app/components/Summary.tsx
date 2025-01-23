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
      <div className="bg-white rounded-lg p-6 shadow-sm mobile:p-4 ">
        <h2 className="text-xl text-[#622BD9] opacity-80 font-semibold mb-4 mobile:text-base">Summary</h2>
        <div className="flex justify-between items-center mobile:p-2">
          <select
            value={selectedTimeFrame}
            onChange={handleTimeFrameChange}
            className="mb-4 w-1/4 p-2 border rounded mobile:mr-1 mobile:w-20 mobile:text-xs "
          >
            <option value="Today">Today</option>
            <option value="Month till date">Month till date</option>
            <option value="Year till date">Year till date</option>
            <option value="Lifetime">Lifetime</option>
          </select>
          <div className="flex justify-between items-center  mobile:justify-center">
            <div className="mr-10 mobile:w-auto  ">
              <div className=" border border-gray-200 rounded-lg p-4 mobile:h-auto">
                <h3 className="text-sm text-gray-500 mobile:text-xs">Money In</h3>
                <p className="text-lg font-semibold text-purple-500 mobile:text-sm">$2.4k</p>
              </div>
              <div className=" border border-gray-200 rounded-lg p-4 mobile:h-auto">
                <h3 className="text-sm text-gray-500 mobile:text-xs  ">Money Out</h3>
                <p className="text-lg font-semibold text-purple-500 mobile:text-sm">$2.4k</p>
              </div>
            </div>
              <div className=" border border-gray-200 rounded-lg p-4 mobile:w-auto">
                <h3 className="text-sm text-gray-500  mobile:text-xs">Current Balance</h3>
                <p className="text-lg font-semibold text-purple-500 mobile:text-sm">
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
