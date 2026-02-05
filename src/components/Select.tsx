import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  withSearch?: boolean;
  placeholder?: string;
};

const FLOATING_Z_INDEX = 2147483647;

export const Select = ({
  label = "label",
  options,
  value,
  onChange,
  multiple = false,
  withSearch = false,
  placeholder = "",
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [usePortal, setUsePortal] = useState(false);
  const [position, setPosition] = useState<DOMRect | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const values = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
      ? [value]
      : [];

  const updatePosition = () => {
    if (!triggerRef.current) return;
    setPosition(triggerRef.current.getBoundingClientRect());
  };

  const toggleValue = (val: string) => {
    if (!multiple) {
      onChange?.(val);
      setOpen(false);
      return;
    }

    const next = values.includes(val)
      ? values.filter((v) => v !== val)
      : [...values, val];

    onChange?.(next as string[]);
  };

  const removeValue = (val: string) => {
    if (!multiple) return;
    const next = values.filter((v) => v !== val);
    onChange?.(next as string[]);
  };

  const highlightMatch = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "ig");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} className="bg-emerald-200 text-emerald-900">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickInsideTrigger = containerRef.current?.contains(target);
      const clickInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickInsideTrigger && !clickInsideDropdown) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    let el: HTMLElement | null = triggerRef.current.parentElement;

    while (el) {
      const style = getComputedStyle(el);
      const overflow = style.overflow + style.overflowX + style.overflowY;

      if (/(auto|scroll|hidden)/.test(overflow)) {
        setUsePortal(true);
        updatePosition();
        return;
      }

      el = el.parentElement;
    }

    setUsePortal(false);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !usePortal) return;

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, usePortal]);


  const dropdown = (
    <div
      ref={dropdownRef}
      style={
        usePortal && position
          ? {
              position: "fixed",
              top: position.bottom,
              left: position.left,
              width: position.width,
              zIndex: FLOATING_Z_INDEX,
            }
          : undefined
      }
      className={`mt-1 bg-white border rounded shadow ${
        usePortal ? "" : "absolute z-50 w-full"
      }`}
    >
      {withSearch && (
        <div className="p-2 border-b">
          <div className="relative flex items-center">
            <span className="absolute left-2 text-gray-400">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>

            <input
              className="w-full rounded pl-8 pr-8 py-1.5 text-sm focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" fill="#999" stroke="#999" />
                  <line x1="16" y1="8" x2="8" y2="16" stroke="#fff" />
                  <line x1="8" y1="8" x2="16" y2="16" stroke="#fff" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      <ul className="max-h-60 overflow-auto">
        {options.map((option) => {
          const selected = values.includes(option.value);

          return (
            <li
              key={option.value}
              onClick={() => toggleValue(option.value)}
              className={`px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                selected ? "bg-gray-50 font-medium" : ""
              }`}
            >
              {highlightMatch(option.label, search)}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div ref={containerRef} className="flex items-center gap-3">
      <label className="flex-1">{label}</label>

      <div className="relative flex-5 w-full">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full min-h-10 border rounded px-3 py-2 text-left bg-white flex flex-wrap gap-1"
        >
          {values.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            values.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val as string}
                  className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-xl text-sm"
                >
                  {opt?.label}
                  {multiple && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(val as string);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="#fff"
                          stroke="#333"
                        />
                        <line x1="16" y1="8" x2="8" y2="16" stroke="#333" />
                        <line x1="8" y1="8" x2="16" y2="16" stroke="#333" />
                      </svg>
                    </button>
                  )}
                </span>
              );
            })
          )}
        </button>

        {open && (usePortal ? createPortal(dropdown, document.body) : dropdown)}
      </div>
    </div>
  );
};
