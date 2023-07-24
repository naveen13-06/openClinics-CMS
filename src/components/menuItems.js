const menuItems = [
    {
      title: 'Medicine',
      submenu: [
        {
          title: 'CVS',
          url: '/?domain=medicine&type=cvs',
        },
        {
          title: 'RS',
          url: '/?domain=medicine&type=rs',
        },
        {
          title: 'CNS',
          url: '/?domain=medicine&type=cns',
        },
        {
            title: 'Renal',
            url: '/?domain=medicine&type=renal',
        },
        {
            title: 'Abdomen',
            url: '/?domain=medicine&type=abdomen',
        },
      ],
    },
    {
    title: 'Og',
      submenu: [
        {
          title: 'Obstetric examination',
          url: '/?domain=og&type=obstetric examination',
        },
        {
          title: 'Gynaecology',
          url: '/?domain=og&type=gynaecology',
        },
      ],
    },
    {
      title: 'Pediatrics',
      submenu: [
        {
          title: 'CVS',
          url: '/?domain=pediatrics&type=cvs',
        },
        {
          title: 'Development',
          url: '/?domain=pediatrics&type=development',
        },
        {
          title: 'RS',
          url: '/?domain=pediatrics&type=rs',
        },
        {
          title: 'CNS',
          url: '/?domain=pediatrics&type=cns',
        },
        {
            title: 'Anthropometry',
            url: '/?domain=pediatrics&type=anthropometry',
        },
        {
            title: 'Abdomen',
            url: '/?domain=pediatrics&type=abdomen',
        },
        {
            title: 'Newborn',
            url: '/?domain=pediatrics&type=newborn',
        },
        {
            title: 'Head to Foot',
            url: '/?domain=pediatrics&type=head_to_foot',
        }
      ],
    },
    {
      title: 'Surgery',
      submenu: [
        {
          title: 'Breast',
          url: '/?domain=surgery&type=breast',
        },
        {
          title: 'Thyroid',
          url: '/?domain=surgery&type=thyroid',
        },
        {
          title: 'Varicose vein',
          url: '/?domain=surgery&type=varicose vein',
        },
        {
          title: 'Swelling',
          url: '/?domain=surgery&type=swelling',
        },
        {
          title: 'Ulcer',
          url: '/?domain=surgery&type=ulcer',
        },
        {
            title: 'Hernia',
            url: '/?domain=surgery&type=hernia',
        },
        {
            title: 'Abdomen',
            url: '/?domain=surgery&type=abdomen',
        },
        {
            title: 'Peripheral arterial disease',
            url: '/?domain=surgery&type=peripheral arterial disease',
        }
      ],
    },
    {
      title: 'Opthalmology',
        submenu: [
          {
            title: 'cataract',
            url: '/?domain=og&type=cata',
          },
        ],
      }
];
export default menuItems;