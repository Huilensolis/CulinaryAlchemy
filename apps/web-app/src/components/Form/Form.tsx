import { type TFormInputArray } from '@/components/Form/models'
import { DeterminateInput } from './components'

import { zodResolver } from '@hookform/resolvers/zod'
import { Suspense, type SyntheticEvent } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { type ZodObject, type ZodRawShape } from 'zod'

import { type IInputStyles } from '@/models/UI'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button/'
import Sheet from '@mui/joy/Sheet/'
import Stack from '@mui/joy/Stack'
import { toast } from 'sonner'
import { adaptDefaultValues } from './adapters'

interface IInputsStyles {
  textArea?: IInputStyles
  textField?: IInputStyles
}


interface IStyles {
  gridColumns?: 1 | 2
  flexWrap?: 'wrap' | 'nowrap'
  display: 'flex' | 'grid'
  width: string
  border?: 'none'
  paddingY?: string
  paddingX?: string
  marginY?: string
  justifyContent?: 'center' | 'start'
  gap?: number
  backgroundColor?: string
}

interface IForm {
  schema: ZodObject<ZodRawShape>
  inputsDataMain: TFormInputArray
  inputsDataFooter?: TFormInputArray
  onSubmit: SubmitHandler<FieldValues>
  Header?: React.ReactNode
  Footer?: React.ReactNode
  defaultValues?: object
  buttonSubmitName: string
  buttonSubmitSide?: 'default' | 'start' | 'end'
  styles: IStyles
  inputStyles?: IInputsStyles
  showResetButton?: boolean
}

const gridFormStyles1 = { display: 'grid', gridTemplateColumns: '1fr', gap: '0.1em' }
const gridFormStyles2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em' }

export const Form: React.FC<IForm> = ({ defaultValues, schema, inputsDataMain, onSubmit, Header, Footer, buttonSubmitName = 'submit', styles, inputStyles, showResetButton = true, buttonSubmitSide, inputsDataFooter }) => {
  const {
    register,
    handleSubmit: defaultHandleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: {
      errors,
      dirtyFields,
      isDirty
    }
  } = useForm<FieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: adaptDefaultValues(defaultValues as object),
    resolver: zodResolver(schema, { async: true }, { mode: 'async' })
  })

  const handleOnClickForReset = () => {
    reset()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnSubmit = defaultHandleSubmit((data: FieldValues, event: React.BaseSyntheticEvent<object, any, any> | undefined) => {
    if (!isDirty) {
      toast('The form is not dirty')
      return
    }

    onSubmit(data, event)
  })

  return (
    <Sheet
      variant='outlined'
      sx={{
        width: '100%',
        maxWidth: styles.width,
        my: styles.marginY ?? 4,
        py: styles.paddingY ?? 3,
        px: styles.paddingX ?? 2,
        borderRadius: 'sm',
        boxShadow: styles.border ?? 'md',
        border: styles.border,
        mx: 'auto',
        backgroundColor: styles.backgroundColor
      }}
    >
      <form onSubmit={handleOnSubmit} noValidate>
        <Sheet
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: styles.backgroundColor
          }}>
          {Header}
          <main>
            <Suspense>
              <Box sx={
                [
                  {
                    display: styles.display,
                    width: '100%',
                    flexWrap: styles.flexWrap,
                    justifyContent: styles.justifyContent
                  },
                  styles.gridColumns === 1 && gridFormStyles1,
                  styles.gridColumns === 2 && gridFormStyles2
                ]
              }
              >
                {inputsDataMain.map((inputData, index) => (
                  <DeterminateInput
                    key={index}
                    data={inputData}
                    register={register(inputData.name,
                      {
                        setValueAs: (value) => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                          return value !== '' ? value : undefined
                        },
                        onChange: (event: SyntheticEvent) => {
                          const value = (event.target as HTMLInputElement).value

                          return value !== '' ? value : undefined
                        }
                      }
                    )}
                    {...{
                      watch,
                      setError,
                      clearErrors,
                      inputStyles
                    }}
                    isDirty={dirtyFields[inputData.name] as boolean}
                    error={errors[inputData.name] != null ? errors[inputData.name]?.message as string : ''}
                  />
                ))}
              </Box>
              <Stack
                direction='row'
                spacing={1}
                marginTop={1}
                justifyContent={buttonSubmitSide}
              >
                {inputsDataFooter?.[0] != null &&
                  inputsDataFooter.map((inputData, index) => (
                    <DeterminateInput
                      key={index}
                      data={inputData}
                      register={register(inputData.name,
                        {
                          setValueAs: (value) => {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                            return value !== '' ? value : undefined
                          },
                          onChange: (event: SyntheticEvent) => {
                            const value = (event.target as HTMLInputElement).value

                            return value !== '' ? value : undefined
                          }
                        }
                      )}
                      {...{
                        watch,
                        setError,
                        clearErrors,
                        inputStyles
                      }}
                      isDirty={dirtyFields[inputData.name] as boolean}
                      error={errors[inputData.name] != null ? errors[inputData.name]?.message as string : ''}
                    />
                  ))}
                <Button
                  type='submit'
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1em',
                    minHeight: '2.6em',
                    borderRadius: '0.4em',
                    flexGrow: buttonSubmitSide === 'default' ? 1 : 0
                  }}
                  disabled={Object.values(errors).length > 0 || (!isDirty && Object.values(errors).length > 0) }
                >
                  {buttonSubmitName}
                </Button>
                {showResetButton &&
                  <Button
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '1em'
                    }}
                    size='sm'
                    variant='outlined'
                    onClick={handleOnClickForReset}
                  >
                    Reset
                  </Button>
                }
              </Stack>
            </Suspense>
          </main>
          {Footer}
        </Sheet>
      </form >
    </Sheet >
  )
}

export default Form
