import React, { useState } from 'react';

// Propsの型定義を追加
type CopyButtonProps = {
  copytext: string;
};

function CopyButton({ copytext }: CopyButtonProps) {
  const [buttonText, setButtonText] = useState('Copy');

  const handleClick = () => {
    setButtonText('Copied');
    navigator.clipboard.writeText(copytext); // propsから渡されたテキストをコピー
    setTimeout(() => {
      setButtonText('Copy');
    }, 1500); // 1.5秒後にテキストを元に戻す
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute end-2.5 bottom-2.5 focus:outline-none font-medium text-sm px-4 py-2"
    >
      {buttonText}
    </button>
  );
}

export default CopyButton;
