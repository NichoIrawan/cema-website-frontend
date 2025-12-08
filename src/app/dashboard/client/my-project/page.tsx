export default function MyProjectPage() {
    return (
        <div className="bg-white border border-gray-200 rounded p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Project</h2>
            <div className="space-y-4">
                <div className="p-6 border border-gray-200 rounded">
                    <h3 className="font-medium text-gray-900 mb-2">Renovasi Villa Bali</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                In Progress
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Service Type:</span>
                            <span className="text-gray-900">Renovasi</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="text-gray-900">Dec 1, 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Progress:</span>
                            <span className="text-gray-900">45%</span>
                        </div>
                    </div>
                </div>
                <div className="p-10 border-2 border-dashed border-gray-300 rounded text-center text-gray-500">
                    Additional project details will appear here
                </div>
            </div>
        </div>
    );
}
