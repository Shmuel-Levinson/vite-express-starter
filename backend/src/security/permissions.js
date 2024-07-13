//everything that has a 'group_id' is a group-resource
//every group user can have varying degrees of permissions to each such resource

const GR = {
    lists: 'lists',
    items: 'items',
    categories: 'categories',
    listItems: 'list_items',
    groupUsers: 'group_users'
}
const x = 0

const buildPermissions = (read = 0, update = 0, create = 0, destroy = 0 ) => {
    return {
        read: read,
        update: update,
        create: create,
        destroy: destroy
    }
}


const NON_ADMIN_GR_PERMISSIONS = {
    [GR.lists]: buildPermissions(1,1,1,0),
    [GR.categories]: buildPermissions(1,1,1,1),
    [GR.listItems]: buildPermissions(1,1,1,1),
    [GR.items]: buildPermissions(1,1,1,1),
    [GR.groupUsers]: buildPermissions(1,0,0,0)
}



class Permissions{
    constructor(read, update, create, destroy) {
        this.read = read
        this.update = update
        this.create = create
        this.destroy = destroy
    }
}

const userHasPermissionToPerformAction = (userPermissions, resource, action) => {
    return userPermissions[resource][action] === 1
}


const test = () => {
    console.log('test running...')
    const up = NON_ADMIN_GR_PERMISSIONS
    console.log(userHasPermissionToPerformAction(up,GR.groupUsers,'read'))
}

test()