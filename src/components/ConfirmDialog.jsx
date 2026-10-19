const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
        <p className="text-sm text-gray-600 mb-5">{message}</p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn-outline">Cancel</button>
          <button onClick={onConfirm} className="btn bg-red-600 hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
