import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { COLORS } from '../../const/colors';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label 
        htmlFor={name}
        className="text-sm font-semibold"
        style={{ color: COLORS.DARK_SLATE }}
      >
        {label}
      </label>
      <Field name={name}>
        {({ field, meta }: any) => (
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`
              px-4 py-3 border-2 rounded-lg transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-offset-1 text-gray-900
              placeholder-gray-500 bg-white
              ${meta.touched && meta.error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-200'
              }
            `}
            style={{
              borderColor: meta.touched && meta.error ? '#ef4444' : '#d1d5db',
              focusBorderColor: meta.touched && meta.error ? '#ef4444' : COLORS.PRIMARY_MEDIUM,
              color: COLORS.DARK_SLATE,
              backgroundColor: COLORS.WHITE,
            }}
            onFocus={(e) => {
              if (!(meta.touched && meta.error)) {
                e.target.style.borderColor = COLORS.PRIMARY_MEDIUM;
              }
            }}
            onBlur={(e) => {
              field.onBlur(e);
              if (!(meta.touched && meta.error)) {
                e.target.style.borderColor = '#d1d5db';
              }
            }}
          />
        )}
      </Field>
      <ErrorMessage 
        name={name} 
        component="span" 
        className="text-sm text-red-500 font-medium" 
      />
    </div>
  );
};

export default InputField;
