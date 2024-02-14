"use client"

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type CollapsibleProps = {
    trigger: JSX.Element,
    children: JSX.Element | JSX.Element[],
    contentClassName?: string,
}

export default function Collapsible({ trigger, children, contentClassName }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [maxHeight, setMaxHeight] = useState<string>("0px");
    const contentRef = useRef<HTMLDivElement>(null);

    const toggle = () => {
        setIsOpen(!isOpen);
        setMaxHeight(isOpen ? "0px" : `${contentRef.current?.scrollHeight}px`);
    };

    useEffect(() => {
        const handleResize = () => {
            if (isOpen && contentRef.current) {
                setMaxHeight(`${contentRef.current.scrollHeight}px`);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        }
    }, [isOpen, children]);

    return (
        <div className="collapsible">
            <div className="collapsible-trigger relative" onClick={toggle}>
                {trigger}
                <ChevronDown className={`absolute right-2 w-4 h-4 transition-transform transform top-1/2 -translate-y-1/2 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <div
                ref={contentRef}
                className={`${contentClassName} overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ maxHeight }}
            >
                {children}
            </div>
        </div>
    );
}
