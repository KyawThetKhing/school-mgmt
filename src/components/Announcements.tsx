import React from 'react'

const Announcements = () => {
    return (
        <div className="mt-4 rounded-md bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div className="rounded-md bg-skyLight p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">
                            Lorem ipsum dolor sit amet consectetur.
                        </h2>
                        <span className="rounded-md bg-white px-1 py-1 text-xs text-gray-400">
                            2025--01-01
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        lorem ipsum dolor sit amet consectetur adipisicing elit
                    </p>
                </div>
                <div className="rounded-md bg-yellowLight p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">
                            Lorem ipsum dolor sit amet consectetur.
                        </h2>
                        <span className="rounded-md bg-white px-1 py-1 text-xs text-gray-400">
                            2025--01-01
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        lorem ipsum dolor sit amet consectetur adipisicing elit
                    </p>
                </div>
                <div className="rounded-md bg-sky p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">
                            Lorem ipsum dolor sit amet consectetur.
                        </h2>
                        <span className="rounded-md bg-white px-1 py-1 text-xs text-gray-400">
                            2025--01-01
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        lorem ipsum dolor sit amet consectetur adipisicing elit
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Announcements
