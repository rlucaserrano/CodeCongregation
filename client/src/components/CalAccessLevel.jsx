const accessPermissions = {
    READ: {
      canViewEvents: true,
      canEditEvents: false,
      canDeleteEvents: false,
      canShareCalendar: false,
      canDeleteCalendar: false,
    },
    WRITE: {
      canViewEvents: true,
      canEditEvents: true,
      canDeleteEvents: false,
      canShareCalendar: false,
      canDeleteCalendar: false,
    },
    // MANAGE: {
    //   canViewEvents: true,
    //   canEditEvents: true,
    //   canDeleteEvents: true,
    //   canShareCalendar: true,
    //   canDeleteCalendar: false,
    // },
    // OWNER: {
    //   canViewEvents: true,
    //   canEditEvents: true,
    //   canDeleteEvents: true,
    //   canShareCalendar: true,
    //   canDeleteCalendar: true,
    // },
    DEFAULT: {
        canViewEvents: true,
        canEditEvents: true,
        canDeleteEvents: true,
        canShareCalendar: true,
        canDeleteCalendar: true,
      },
  };
  
  export const getPermissions = (accessLevel) => {
    return accessPermissions[accessLevel] || accessPermissions.DEFAULT;
  };