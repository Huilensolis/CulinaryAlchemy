import { Form, TabPanel } from '@/components'
import { useTranslation } from '@/hooks'
import { CTabsData, dietaryPreferencesInputsSchema, dietaryPreferencesSelectedInputsArray } from '@/pages/Settings/models/UI'
import { type SubmitHandler } from 'react-hook-form'

const DietaryPreferencesPanel = () => {
  const { t } = useTranslation()

  const handleOnSubmit: SubmitHandler<Record<string, boolean>> = (data) => {
    console.log(data)
  }

  return (
        <TabPanel
            routingBy='routingSystem'
            value={CTabsData.dietaryPreferences.name}
            loading={false}
            title={CTabsData.dietaryPreferences.traduction}
            description={CTabsData.dietaryPreferences.description}
            showBackNavigation={false}
        >
          <Form
            buttonSubmitName={t('save')}
            onSubmit={handleOnSubmit}
            inputsData={dietaryPreferencesSelectedInputsArray}
            schema={dietaryPreferencesInputsSchema}
            buttonSubmitSide='default'
            styles={{
              flexWrap: 'wrap',
              width: '100%',
              border: 'none',
              display: 'flex',
              marginY: '1em',
              paddingY: '0px',
              justifyContent: 'center'
            }}
          />
        </TabPanel>
  )
}

export default DietaryPreferencesPanel
