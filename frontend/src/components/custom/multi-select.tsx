"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export type SelectValue = Record<"value" | "label", string>;
type MultiSelectProps = {
    label: string;
    options: SelectValue[];
    setSelected: React.Dispatch<React.SetStateAction<SelectValue[]>>;
    selected: SelectValue[];
};

export function MultiSelect({ options, label, setSelected, selected }: MultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputSelectValue, setInputSelectValue] = React.useState("");

    const handleUnselect = React.useCallback((framework: SelectValue) => {
        setSelected(prev => prev.filter(s => s.value !== framework.value));
    }, []);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "") {
                    setSelected(prev => {
                        const newSelected = [...prev];
                        newSelected.pop();
                        return newSelected;
                    });
                }
            }

            if (e.key === "Escape") {
                input.blur();
            }
        }
    }, []);

    const selectables = options.filter(item => !selected.includes(item));

    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-muted ">
            <div
                className="bg-card group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            >
                <div className="flex gap-1 flex-wrap">
                    {selected.map((item, id) => {
                        return (
                            <Badge key={id} variant="default">
                                {item.label}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(item);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(item)}
                                    type="button"
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        )
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputSelectValue}
                        onValueChange={setInputSelectValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={label}
                        className="ml-2 bg-card outline-none placeholder:text-muted-foreground flex-1"
                    />
                </div>
            </div>
            <div className="relative mt-2 z-[100000000000]">
                {open && selectables.length > 0 ?
                    <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandGroup className="h-full overflow-auto">
                            {selectables.map((item, id) => {
                                return (
                                    <CommandItem
                                        key={id}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={(value) => {
                                            setInputSelectValue("")
                                            setSelected(prev => [...prev, item])
                                        }}
                                        className={"cursor-pointer"}
                                    >
                                        {item.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </div>
                    : null}
            </div>
        </Command >
    )
}
