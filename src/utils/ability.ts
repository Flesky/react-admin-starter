import type { PureAbility } from '@casl/ability'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

type Roles = 'admin' | 'employee'

export type Action = 'view' | 'add' | 'edit' | 'delete' | 'manage'
export type Subject = 'all'

export default function defineAbilityFor(role: Roles) {
  const { can, build } = new AbilityBuilder<PureAbility<[Action, Subject]>>(createMongoAbility)

  if (role === 'admin')
    can('manage', 'all')

  if (role === 'employee')
    can('view', 'all')

  return build()
}
