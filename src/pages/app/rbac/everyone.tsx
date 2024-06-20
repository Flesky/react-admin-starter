import { Button } from '@mantine/core'
import { useContext } from 'react'
import AppPageContainer from '@/components/app/AppPageContainer.tsx'
import { AbilityContext, Can } from '@/components/app/Can.tsx'
import defineAbilityFor from '@/utils/ability.ts'

export default function Everyone() {
  const ability = useContext(AbilityContext)

  return (
    <AppPageContainer title="Everyone">
      <Can I="view" a="all">
        <div>Everyone can read articles</div>
      </Can>
      <Can I="manage" a="all">
        <div>Only authors can update articles</div>
      </Can>
      <Button onClick={() => ability.update(defineAbilityFor('admin').rules)}>
        Update
      </Button>
    </AppPageContainer>
  )
}
