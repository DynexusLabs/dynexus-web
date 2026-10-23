"use client";

const ScanLine = () => {
  return (
    <style jsx>{`
      @keyframes grid-move {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(50px, 50px);
        }
      }
      @keyframes scan-line {
        0% {
          top: 20%;
          opacity: 1;
        }
        100% {
          top: 80%;
          opacity: 0.3;
        }
      }
    `}</style>
  );
};

export default ScanLine;
