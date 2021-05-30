import React from 'react';
import { Button } from 'react-bootstrap';
import './ErrorModal.css';

const ErrorModal = React.memo(props => {
  return (
    <React.Fragment>
      <div className="backdrop" onClick={props.onClose} />
      <div className="error-modal">
        <h2>An Error Occurred!</h2>
        <p>{props.children}</p>
        <div className="error-modal__actions">
          <Button variant="primary" type="button" onClick={props.onClose}>
            Okay
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
});

export default ErrorModal;
