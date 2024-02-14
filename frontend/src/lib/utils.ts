import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function NumberToShortString(num: number) {
    if (num < 1000) {
        return num.toString()
    }
    if (num < 1000000) {
        return (num / 1000).toFixed(1) + "k"
    }
    return (num / 1000000).toFixed(1) + "m"
}

export function deepComparison(obj1: any, obj2: any) {
    const diff = {} as any
    for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
            diff[key] = obj2[key]
        }
    }
    return diff
}