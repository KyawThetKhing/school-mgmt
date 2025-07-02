import { FieldError } from 'react-hook-form'

type InputFieldProps = {
    label: string
    type?: string
    register: any
    name: string
    defaultValue?: string
    error?: FieldError
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
    hidden?: boolean
}

const InputField = ({
    label,
    type = 'text',
    register,
    name,
    defaultValue,
    error,
    inputProps,
    hidden,
}: InputFieldProps) => {
    return (
        <div className={hidden ? 'hidden' : 'flex w-full flex-col gap-2'}>
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type={type}
                {...register(name)}
                className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                {...inputProps}
                defaultValue={defaultValue}
                hidden={hidden}
            />
            {error?.message && (
                <p className="text-xs text-red-400">
                    {error.message.toString()}
                </p>
            )}
        </div>
    )
}

export default InputField
