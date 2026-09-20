import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ActionsMenuProps {
  items: ActionMenuItem[];
}

const MENU_WIDTH = 208;
const MENU_MARGIN = 8;

export function ActionsMenu({ items }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();

    let top = buttonRect.bottom + 4;
    let left = buttonRect.right - MENU_WIDTH;

    // Evita que el menú salga por la derecha
    left = Math.max(
      MENU_MARGIN,
      Math.min(
        left,
        window.innerWidth - MENU_WIDTH - MENU_MARGIN,
      ),
    );

    // Si el menú ya existe, podemos saber su altura
    if (menuRef.current) {
      const menuHeight = menuRef.current.offsetHeight;

      const spaceBelow =
        window.innerHeight - buttonRect.bottom;

      const spaceAbove = buttonRect.top;

      // Si no cabe abajo y hay más espacio arriba,
      // lo mostramos arriba del botón.
      if (
        spaceBelow < menuHeight + MENU_MARGIN &&
        spaceAbove > menuHeight + MENU_MARGIN
      ) {
        top = buttonRect.top - menuHeight - 4;
      }
    }

    setPosition({
      top,
      left,
    });
  };

  const handleToggle = () => {
    setOpen((value) => !value);
  };

  /*
   * Primero se abre el menú.
   * Después de renderizarlo calculamos su posición real.
   */
  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();
  }, [open, items]);

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [open]);

  const handleAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        aria-label="Acciones"
        aria-expanded={open}
      >
        <MoreVertical size={18} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] w-52 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {items.map((item, index) => (
              <div key={item.label}>
                {item.danger && index > 0 && (
                  <div className="my-1 border-t border-gray-100" />
                )}

                <button
                  type="button"
                  onClick={() => handleAction(item.onClick)}
                  className={`w-full px-4 py-2 text-sm transition-colors ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}