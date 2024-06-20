import { createContext } from 'react'
import { createContextualCan } from '@casl/react'
import defineAbilityFor from '@/utils/ability.ts'

export const AbilityContext = createContext(defineAbilityFor('employee'))
export const Can = createContextualCan(AbilityContext.Consumer)
