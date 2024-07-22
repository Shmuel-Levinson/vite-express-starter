import {useState, useEffect, useRef} from 'react';

type UseDebounceOptions = {
    initialValue?: string;
    runCallbackOnFalsy?: boolean;
    disableCallback?: boolean;
    onChange?: (value: string) => void;
}

function useDebounce(callback: (value: string | undefined) => void, delay: number, options: UseDebounceOptions = {runCallbackOnFalsy: false}): [string, (value: string) => void] {
    const initialValue: string = options.initialValue || "";
    const [value, setValue] = useState<string>(initialValue);
    const handler = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => {
        if (options.disableCallback === true) {
            return;
        }
        if (options.onChange) {
            options.onChange(value);
        }
        if (handler.current) {
            clearTimeout(handler.current);
        }
        handler.current = setTimeout(() => {
            if (options.runCallbackOnFalsy === true) {
                callback(value);
            } else if (value) {
                callback(value);
            }
        }, delay);

        return () => {
            if (handler.current) {
                clearTimeout(handler.current);
            }
        };
    }, [value]);

    return [value, setValue];
}

export default useDebounce;
