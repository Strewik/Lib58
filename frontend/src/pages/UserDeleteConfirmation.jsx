import "./UserDelete.css";

const UserDeleteConfirmation = ({ user, onConfirm, onCancel }) => {
  return (
    <div className="overlay">
      <div className="delete-confirmation">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete {user.full_name}?</p>
        <button onClick={() => onConfirm(user.id)}>Yes, Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default UserDeleteConfirmation;


