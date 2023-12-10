import { useRef, MouseEvent, RefObject } from 'react'

export enum EExpandDirection {
  HORIZONTAL,
  VERTICAL,
  BOTH
}
export type useExpandResult = {
  wrapper: { ref: RefObject<HTMLDivElement> },
  container1: { ref: RefObject<HTMLDivElement> },
  container2: { ref: RefObject<HTMLDivElement> },
  trigger: {
    onMouseDown: any,
    onMouseUp: any,
    onDragStart: any,
    ref: RefObject<HTMLButtonElement>,
  }
}

export function useExpand(direction: EExpandDirection): useExpandResult {
  //* Elements
  const wrapper = useRef<HTMLDivElement>(null)
  const container1 = useRef<HTMLDivElement>(null)
  const container2 = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  function expandHeight(pageY: number, triggerShiftY: number) {
    if (!wrapper.current || !container1.current || !container2.current) return
    //* height and top computations
    const _height = pageY - triggerShiftY
    // console.log(wrapper.current.offsetHeight, _height)
    if (0 > _height || wrapper.current.offsetHeight - 20 < _height) {
      // console.log(`return onMouseUp()`)
      return onMouseUp()
    }
    //* Applying styles
    container1.current.style.height = `calc(100% - ${_height}px)`;
    container2.current.style.height = `${_height}px`;
  }
  function expandWidth(pageX: number, triggerShiftX: number) {
    if (!wrapper.current || !container1.current || !container2.current) return
    //* height and top computations
    const computedDifference = pageX// - triggerShiftX
    //* Applying styles
    wrapper.current.style.gridTemplateColumns = `${computedDifference}px calc(100% - ${computedDifference}px)`
    // container1.current.style.width = `calc(100% - ${computedDifference}px)`;
    // container2.current.style.width = `${computedDifference}px`;
  }

  function onMouseDown({ clientX, clientY, pageX, pageY }: MouseEvent<HTMLButtonElement>) {
    if (!wrapper.current || !trigger.current || !container1.current || !container2.current) return

    //* Shift relative cursor position within trigger element
    const triggerRect = trigger.current.getBoundingClientRect()
    // `triggerRect.height / 2` need for `translate(50%, -50%)` in SCSS
    const shiftX = clientX - triggerRect.left
    const shiftY = clientY - triggerRect.top - triggerRect.height / 2

    //* Closure trigger and shiftY for expand section
    function _expandHeight({ pageY }: { pageY: number }) {
      expandHeight(pageY, shiftY)
    }
    function _expandWidth({ pageX }: { pageX: number }) {
      expandWidth(pageX, shiftX)
    }
    //* Usage
    if (direction === EExpandDirection.VERTICAL) {
      _expandHeight({ pageY })
      wrapper.current.onmousemove = _expandHeight
    }
    else if (direction === EExpandDirection.HORIZONTAL) {
      _expandWidth({ pageX })
      wrapper.current.onmousemove = _expandWidth
    }
    else { // BOTH
      _expandWidth({ pageX })
      _expandHeight({ pageY })
      wrapper.current.onmousemove = (event: { pageX: number; pageY: number }) => {
        _expandWidth(event)
        _expandHeight(event)
      }
    }
    wrapper.current.onmouseup = onMouseUp
  }
  function onMouseUp() {
    if (!wrapper.current) return
    wrapper.current.onmousemove = null
    wrapper.current.onmouseup = null
  }
  function onDragStart() {
    return false
  }

  return {
    wrapper: { ref: wrapper },
    container1: { ref: container1 },
    container2: { ref: container2 },
    trigger: {
      onMouseDown,
      onMouseUp,
      onDragStart,
      ref: trigger,
    }
  }
}