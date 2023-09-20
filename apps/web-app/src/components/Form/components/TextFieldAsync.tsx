import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input, { inputClasses } from '@mui/joy/Input'
import { type FieldValues, type UseFormClearErrors, type UseFormRegisterReturn, type UseFormSetError, type UseFormWatch } from 'react-hook-form'

import { Error } from '@/components/Form/components/'
import { useAsyncValidations } from '@/components/Form/hooks'
import { type TTextFieldForm } from '@/components/Form/models'
import CircularProgress from '@mui/joy/CircularProgress'

interface IProps {
  data: TTextFieldForm
  error: string
  register: UseFormRegisterReturn<string>
  watch: UseFormWatch<FieldValues>
  setError: UseFormSetError<FieldValues>
  clearErrors: UseFormClearErrors<FieldValues>
  isDirty: boolean
}

const TextFieldAsync: React.FC<IProps> = ({ data, error, register, watch, setError, clearErrors, isDirty }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const watchValue = error === '' ? watch(data.name) : null
  const { loading } = useAsyncValidations({ inputName: data.name, watchValue: watchValue as string, setError, clearErrors, isDirty })

  return (
    <FormControl sx={{ marginBottom: '0.5em' }}>
      <FormLabel>{data.label}</FormLabel>
      <Input
        endDecorator={
          loading && <CircularProgress size='sm' variant="outlined" color='neutral' />
        }
        sx={{
          [inputClasses.root]: {
            backgroundColor: 'transparent'
          },
          minWidth: '1px',
          '--Input-minWidth': '1px'
        }}
        autoComplete='off'
        defaultValue={data.defaultValue as string}
        type={data.type}
        placeholder={data.placeholder}
        {...(error !== '' && { error: true })}
        {...register}
      />
      <Error text={error} />
    </FormControl>
  )
}

export default TextFieldAsync
