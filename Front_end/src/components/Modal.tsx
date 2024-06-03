import React from "react";

const Modal = ({
  isVisible,
  onClose,
 
  children,
}: {
  isVisible: boolean;
  onClose: () => void;

  children: React.ReactNode;
}) => {
  const handleClose = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "wrapper") onClose();
  };
  if (!isVisible) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 
            backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className=" flex flex-col w-[600px]">
        <button className="place-self-end text-white" onClick={onClose}>
          X
        </button>
        <div className="bg-white p-2">
          {children}
       
        </div>
      </div>
    </div>
  );
};

export default Modal;
