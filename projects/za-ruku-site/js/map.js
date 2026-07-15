ymaps.ready(init)

function init() {
  const myMap = new ymaps.Map("YMap", {
    center: [55.755864, 37.617698],
    zoom: 12
  })

  const coordinates = [
    { city: 'Москва', coords: [55.755864, 37.617698] },
    { city: 'Санкт-Петербург', coords: [59.938784, 30.314997] },
    { city: 'Ростов-на-Дону', coords: [47.222109, 39.718813] },
  ]
  
  const types = [
    { type: 'Все нозологии' },
    { type: 'Рак легкого' },
    { type: 'Рак печени' },
    { type: 'Рак мочевого пузыря' },
    { type: 'Рак молочной железы' },
    { type: 'Меланома' },
    { type: 'Лимфома' },
    { type: 'Питание' },
  ]
  
  const forms = [
    { form: 'Неважно' },
    { form: 'По полису ОМС' },
    { form: 'На коммерческой основе' },
  ]
  
  function appendListItems(containerSelector, items, key) {
    const container = document.querySelector(containerSelector)
    if (container) {
      const list = container.querySelector('.events__search-dropdowns-dropdown-item-list')
      if (list) {
        items.forEach(item => {
          const li = document.createElement('li')
          const p = document.createElement('p')
          p.textContent = item[key]
          li.appendChild(p)
          list.appendChild(li)
        })
      }
    }
  }
  
  appendListItems('#cityFilter', coordinates, 'city')
  appendListItems('#typeFilter', types, 'type')
  appendListItems('#formFilter', forms, 'form')

  const points = [
    { city: 'Москва', coords: [55.772951, 37.245593], name: 'Ильинская больница', type: 'Рак легкого', form: 'По полису ОМС', 
      address: 'Московская область, г.о. Красногорск, д. Глухово, ул. Рублевское предместье, д.2, корп.2', phone: '+7 (495) 000-00-00', phoneH: 'tel:+74950000000', site: 'https://ihospital.ru/'
    },
    { city: 'Москва', coords: [55.772951, 37.255593], name: 'Ильинская больница', type: 'Рак печени', form: 'По полису ОМС', 
      address: 'Московская область, г.о. Красногорск, д. Глухово, ул. Рублевское предместье, д.2, корп.2', phone: '+7 (495) 000-00-00', phoneH: 'tel:+74950000000', site: 'https://ihospital.ru/'
    },
    { city: 'Москва', coords: [55.772556, 37.264444], name: 'Медскан', type: 'Рак печени', form: 'На коммерческой основе',
      address: 'Москва, 1 городской округ Красногорск, деревня Глухово, ул. Центральная, д. 34А', phone: '+7 (495) 126-96-07', site: 'https://medscannet.ru/'
    },
    { city: 'Москва', coords: [55.772556, 37.274444], name: 'Медскан', type: 'Рак печени', form: 'На коммерческой основе',
      address: 'Москва, 1 городской округ Красногорск, деревня Глухово, ул. Центральная, д. 34А', phone: '+7 (495) 126-96-07', site: 'https://medscannet.ru/'
    },
    { city: 'Санкт-Петербург', coords: [60.125086, 30.136506], name: 'МИБС', type: 'Рак мочевого пузыря', form: 'По полису ОМС',
      address: 'СПб, Курортный район, пос. Песочный, ул. Карла Маркса, д. 43', phone: '+7 (812) 244-00-24', site: 'https://radiosurgery.ldc.ru/'
    },
    { city: 'Санкт-Петербург', coords: [59.984653, 30.294440], name: 'Онкологический центр De Vita', type: 'Рак молочной железы', form: 'На коммерческой основе',
      address: 'СПб, ул. Савушкина, 14Б', phone: '+7 (812) 952-83-73', site: 'https://cpm-devita.ru/'
    },
    { city: 'Ростов-на-Дону', coords: [47.225705, 39.695970], name: 'КДЦ ЗДОРОВЬЕ', type: 'Меланома', form: 'Неважно',
      address: 'Ростов-на-Дону, пер. Доломановский, 70/3', phone: '+7 (863) 2222-333', site: 'https://www.center-zdorovie.ru/'
    }
  ]

  const dropdownItems = document.querySelectorAll('.map__wrapper-filters-wrapper .events__search-dropdowns-dropdown')

  dropdownItems.forEach(dropdownItem => {
    const dropdownItemName = dropdownItem.querySelector('.events__search-dropdowns-dropdown-item-active')
    const dropdownItemList = dropdownItem.querySelector('.events__search-dropdowns-dropdown-item-list')
    const dropdownItemListItems = dropdownItem.querySelectorAll('.events__search-dropdowns-dropdown-item-list li')

    dropdownItemName.addEventListener('click', () => {
      dropdownItemList.classList.toggle('active')
      dropdownItemName.classList.toggle('active')
    })

    dropdownItemListItems.forEach(dropdownItemListItem => {
      dropdownItemListItem.addEventListener('click', () => {
        const dropdownItemListItemText = dropdownItemListItem.textContent
        dropdownItemList.classList.remove('active')
        dropdownItemName.classList.remove('active')
        dropdownItemName.querySelector('span').textContent = dropdownItemListItemText
      })
    })
    
    document.addEventListener('click', (event) => {
      const targetElement = event.target
      if (!dropdownItem.contains(targetElement)) {
        dropdownItemList.classList.remove('active')
        dropdownItemName.classList.remove('active')
      }
    })
  })

  points.forEach(function(point) {
    const balloonContent = `
      <div class="balloon-content">
        <p class="balloon-content-name">${point.name}</p>
        <p class="balloon-content-adress">${point.address}</p>
        <a href="tel:${point.phone.replace(/\D/g, '')}" class="balloon-content-tel">${point.phone}</a>
        <a href="${point.site}" target="_blank" class="balloon-content-link">Перейти на сайт</a>
      </div>
    `
    const placemark = new ymaps.Placemark(point.coords, {
      balloonContent: balloonContent,
    }, {
      iconLayout: 'default#image',
      iconImageHref: "./img/ballon.svg",
      iconImageSize: [40, 40]
    })

    myMap.geoObjects.add(placemark)

    const listItem = document.createElement('div')
    listItem.classList.add('map__wrapper-list-table')
    listItem.innerHTML = `
      <p class="map__wrapper-list-table-name">${point.name}</p>
      <p class="map__wrapper-list-table-adress">${point.address}</p>
      <a href="${point.phoneH}">${point.phone}</a>
    `
    document.querySelector('.map__wrapper-list.map').appendChild(listItem)
  })

  let selectedCity = null
  let selectedType = null
  let selectedForm = null

  const cityFilter = document.querySelectorAll('#cityFilter .events__search-dropdowns-dropdown-item-list li')
  const typeFilter = document.querySelectorAll('#typeFilter .events__search-dropdowns-dropdown-item-list li')
  const formFilter = document.querySelectorAll('#formFilter .events__search-dropdowns-dropdown-item-list li')

  function applyFilters() {
    const filteredPoints = points.filter(point => {
      if (selectedCity && point.city !== selectedCity) return false
      if (selectedType && selectedType !== 'Все нозологии' && point.type !== selectedType) return false
      if (selectedForm && selectedForm !== 'Неважно' && point.form !== selectedForm) return false
      return true
    })

    myMap.geoObjects.removeAll()
    document.querySelector('.map__wrapper-list.map').innerHTML = ''

    filteredPoints.forEach(function(point) {
      const balloonContent = `
        <div class="balloon-content">
          <p class="balloon-content-name">${point.name}</p>
          <p class="balloon-content-adress">${point.address}</p>
          <a href="tel:${point.phone.replace(/\D/g, '')}" class="balloon-content-tel">${point.phone}</a>
          <a href="${point.site}" target="_blank" class="balloon-content-link">Перейти на сайт</a>
        </div>
      `
    
      const placemark = new ymaps.Placemark(point.coords, {
        balloonContent: balloonContent,
      }, {
        iconLayout: 'default#image',
        iconImageHref: "./img/ballon.svg",
        iconImageSize: [40, 40]
      })
    
      myMap.geoObjects.add(placemark)
      
      const listItem = document.createElement('div')
      listItem.classList.add('map__wrapper-list-table')
      listItem.innerHTML = `
        <p class="map__wrapper-list-table-name">${point.name}</p>
        <p class="map__wrapper-list-table-adress">${point.address}</p>
        <a href="${point.phoneH}">${point.phone}</a>
      `
      document.querySelector('.map__wrapper-list.map').appendChild(listItem)
     
    })
  }

  cityFilter.forEach(function(item) {
    item.addEventListener('click', function() {
      selectedCity = item.textContent.trim()
      applyFilters()

      const cityObject = coordinates.find(item => item.city === selectedCity)
      if (cityObject) {
        myMap.setCenter(cityObject.coords, 12)
      }
    })
  })

  typeFilter.forEach(function(item) {
    item.addEventListener('click', function() {
      selectedType = item.textContent.trim()
      applyFilters()
    })
  })

  formFilter.forEach(function(item) {
    item.addEventListener('click', function() {
      selectedForm = item.textContent.trim()
      applyFilters()
    })
  })
}