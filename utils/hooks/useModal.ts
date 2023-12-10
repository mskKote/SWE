import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useRef
} from 'react'

export type ModalHookProps = {
  closeKeyboardKeys: string[]
}
export type ModalHookResult = {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  show: (options?: any) => void;
  close: () => void;
  toggle: () => void;
  closeBtn: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
  options: any
}


const defaultProps = {
  closeKeyboardKeys: ["escape"]
}

/**
 * Incapsulate modal logic
 * @returns all methods for modal
 */
export function useModal({ closeKeyboardKeys }: ModalHookProps = defaultProps): ModalHookResult {
  const [isVisible, setVisible] = useState(false)
  const optionsRef = useRef(null)
  const show = (options: any) => {
    optionsRef.current = options
    setVisible(true)
  }
  const close = () => setVisible(false)
  const toggle = () => setVisible(x => !x)

  function keydownHandler({ key }: KeyboardEvent) {
    if (closeKeyboardKeys.includes(key)) close();
  }

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => document.removeEventListener('keydown', keydownHandler);
  });

  return {
    isVisible,
    setVisible,
    show,
    close,
    toggle,
    closeBtn: {
      onClick: close
    },
    options: optionsRef.current
  }
}