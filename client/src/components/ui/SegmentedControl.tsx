import { motion } from "framer-motion";
import { useId, type ReactNode } from "react";

type Option<T extends string> = {
    label: ReactNode;
    value: T;
};

interface Props<T extends string> {
    value: T;
    onChange: (v: T) => void;
    options: Option<T>[];
    disabled?: boolean;
}

function SegmentedControl<T extends string>({
    value,
    onChange,
    options,
    disabled = false,
}: Props<T>) {

    const id = useId();

    return (
        <div
            className={`
                inline-flex border border-(--border) font-mono text-xs relative
                transition-all duration-200
                ${disabled ? "opacity-50 blur-[1px] pointer-events-none" : ""}
            `}
        >
            {options.map((opt) => {
                const active = opt.value === value;

                return (
                    <button
                        key={opt.value}
                        onClick={() => {
                            if (disabled) return; // extra safety
                            onChange(opt.value);
                        }}
                        className="relative px-3 py-1.5 flex items-center justify-center"
                    >
                        {active && (
                            <motion.div
                                layoutId={`seg-pill-${id}`}
                                className="absolute inset-[2px] bg-(--text) z-0"
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 35,
                                }}
                            />
                        )}

                        <span
                            className={`
                                relative z-10 transition-colors duration-150
                                ${active ? "text-(--bg)" : "text-(--text)"}
                            `}
                        >
                            {opt.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export default SegmentedControl;