import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../../utils/helpers';

interface OTPInputProps {
  length: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  hasSuccess?: boolean;
}

export function OTPInput({ length, onComplete, disabled = false, hasError = false, hasSuccess = false }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array.from({ length }, () => ''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    inputsRef.current[index]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^[0-9]?$/.test(value)) return;

      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);

      if (value && index < length - 1) {
        focusInput(index + 1);
      }

      if (newValues.every((v) => v.length === 1)) {
        onComplete(newValues.join(''));
      }
    },
    [values, length, focusInput, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !values[index] && index > 0) {
        focusInput(index - 1);
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        focusInput(index - 1);
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [values, length, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (!pasted) return;

      const newValues = Array.from({ length }, (_, i) => pasted[i] ?? '');
      setValues(newValues);

      const nextEmpty = newValues.findIndex((v) => !v);
      focusInput(nextEmpty === -1 ? length - 1 : nextEmpty);

      if (newValues.every((v) => v.length === 1)) {
        onComplete(newValues.join(''));
      }
    },
    [length, focusInput, onComplete]
  );

  useEffect(() => {
    if (!disabled) {
      focusInput(0);
    }
  }, [disabled, focusInput]);

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Dígito ${index + 1} de ${length}`}
          className={cn(
            'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white',
            hasError && 'border-[var(--color-error)] text-[var(--color-error)] animate-shake focus:ring-[var(--color-error)]',
            hasSuccess && 'border-[var(--color-success)] text-[var(--color-success)] focus:ring-[var(--color-success)]',
            !hasError && !hasSuccess && 'border-slate-200 text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      ))}
    </div>
  );
}
