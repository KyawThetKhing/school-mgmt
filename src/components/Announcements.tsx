import React from 'react'

const Announcements = () => {
    return (
        <div className="bg-white p-4 rounded-md mt-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-skyLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">
                            Lorem ipsum dolor sit amet consectetur.
                        </h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                            2025--01-01
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        lorem ipsum dolor sit amet consectetur adipisicing elit
                    </p>
                </div>
                <div className="bg-yellowLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">
                            Lorem ipsum dolor sit amet consectetur.
                        </h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                            2025--01-01
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        lorem ipsum dolor sit amet consectetur adipisicing elit
                    </p>
                </div>
                <div className="bg-sky rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">
                            Lorem ipsum dolor sit amet consectetur.
                        </h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                            2025--01-01
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        lorem ipsum dolor sit amet consectetur adipisicing elit
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Announcements
