
import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`relative flex w-full touch-none select-none items-center ${className}`}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-700">
      <SliderPrimitive.Range className="absolute h-full bg-indigo-600" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-600 bg-gray-900 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

// Because we can't use npm packages directly, we mock Radix UI with a simple range input
// This will not look as good, but it will be functional.
interface SimpleSliderProps {
    min: number;
    max: number;
    step: number;
    value: number[];
    onValueChange: (value: number[]) => void;
    className?: string;
}

export const SimpleSlider: React.FC<SimpleSliderProps> = ({ min, max, step, value, onValueChange, className }) => {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => onValueChange([parseFloat(e.target.value)])}
            className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${className}`}
        />
    );
}

// We'll export the simple slider as the default slider to use in the app
export { SimpleSlider as Slider };
