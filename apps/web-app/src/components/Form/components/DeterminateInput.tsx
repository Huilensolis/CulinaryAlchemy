import { type TInputForm } from '@/components/Form/models'
import { type IInputStyles } from '@/models/UI'
import { lazy } from 'react'
import { type FieldValues, type UseFormClearErrors, type UseFormRegisterReturn, type UseFormSetError, type UseFormWatch } from 'react-hook-form'

const DropZone = lazy(() => import('@/components/Form/components/DropZone'))
const TextArea = lazy(() => import('@/components/Form/components/TextArea'))
const TextField = lazy(() => import('@/components/Form/components/TextField'))
const TextFieldAsync = lazy(() => import('@/components/Form/components/TextFieldAsync'))
const CheckBox = lazy(() => import('@/components/Form/components/CheckBox'))

interface IInputsStyles {
  textArea?: IInputStyles
  textField?: IInputStyles
}

interface IProps {
  data: TInputForm
  register: UseFormRegisterReturn<string>
  error: string
  watch: UseFormWatch<FieldValues>
  setError: UseFormSetError<FieldValues>
  clearErrors: UseFormClearErrors<FieldValues>
  isDirty: boolean
  inputStyles?: IInputsStyles
}

export const DeterminateInput: React.FC<IProps> = ({ data, register, error, watch, setError, clearErrors, isDirty, inputStyles }) => {
  if (data.formInputType === 'textField' && data.async) {
    return <TextFieldAsync {...{ data, register, error, watch, setError, clearErrors, isDirty }} />
  }
  if (data.formInputType === 'textField') {
    return <TextField {...{ data, register, error, styles: inputStyles?.textField }} />
  }
  if (data.formInputType === 'textArea') {
    return <TextArea {...{ data, register, error, styles: inputStyles?.textArea }}/>
  }
  if (data.formInputType === 'dropZone') {
    return <DropZone {...{ data, register, error }}/>
  }
  if (data.formInputType === 'checkbox') {
    return <CheckBox {...{ data, register, watch }}/>
  }

  return <h1>Invalid input type</h1>
}
