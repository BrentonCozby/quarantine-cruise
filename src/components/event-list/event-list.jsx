import React, {useState, useEffect} from 'react'
import {Card, Button, List, Skeleton, Layout, Row, Col, Select, Input, DatePicker, Badge} from 'antd'
import {Link} from 'react-router-dom'
import {format, addHours, subHours, isAfter, isValid, isSameDay} from 'date-fns'
import {LinkOutlined, CalendarTwoTone} from '@ant-design/icons'
import Media from 'react-media'
import './event-list.less'

const scheduledCategoryOptions = [
  {id: 'all', label: 'All'},
  {id: 'education', label: 'Education'},
  {id: 'fitnessAndWellness', label: 'Fitness & Wellness'},
  {id: 'artAndMusic', label: 'Art & Music'},
  {id: 'other', label: 'Other'}
]

const skeletonData = ['row 1', 'row 2', 'row 3']

function EventListComponent({
  loadMoreSize = 8
}) {
  const [educationData, setEducationData] = useState([])
  const [artAndMusicData, setArtAndMusicData] = useState([])
  const [fitnessAndWellnessData, setFitnessAndWellnessData] = useState([])
  const [otherData, setOtherData] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [allScheduledData, setAllScheduledData] = useState([])
  const [allAnytimeData, setAllAnytimeData] = useState([])
  const [fullEventList, setFullEventList] = useState([])
  const [visibleEventList, setVisibleEventList] = useState([])
  const [categoryOptions, setCategoryOptions] = useState(scheduledCategoryOptions)
  const [hasMoreResults, setHasMoreResults] = useState(true)
  const [searchTerm, setSearchTerm] = useState()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [eventType, setEventType] = useState('scheduled')
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => { // setAllScheduledData
    setIsLoading(true)

    Promise.all([
      fetch('/data/educationData.json').then(res => res.json()).then(data => setEducationData(data)),
      fetch('/data/artAndMusicData.json').then(res => res.json()).then(data => setArtAndMusicData(data)),
      fetch('/data/fitnessAndWellnessData.json').then(res => res.json()).then(data => setFitnessAndWellnessData(data)),
      fetch('/data/otherData.json').then(res => res.json()).then(data => setOtherData(data)),
      fetch('/data/anytimeData.json').then(res => res.json()).then(data => setAllAnytimeData(data))
    ]).then(() => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if ([educationData, artAndMusicData, fitnessAndWellnessData, otherData].some(d => !d)) {
      return
    }

    const allEventsWithDates = [].concat(educationData, artAndMusicData, fitnessAndWellnessData, otherData)
    .filter(({datetime}) => isAfter(new Date(datetime), subHours(new Date(), 1)))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

    setAllScheduledData(allEventsWithDates)
  }, [educationData, artAndMusicData, fitnessAndWellnessData, otherData])

  useEffect(() => { // setFullEventList and setVisibleEventList
    let newEventList = []

    if (eventType === 'scheduled') {
      if (selectedCategory === 'all') {
        newEventList = [].concat(allScheduledData)
      } else {
        newEventList = [].concat(allScheduledData.filter(event => event.category === selectedCategory))
      }
    }

    if (eventType === 'anytime') {
      if (selectedCategory === 'all') {
        newEventList = [].concat(allAnytimeData)
      } else {
        newEventList = [].concat(allAnytimeData.filter(event => event.category === selectedCategory))
      }
    }

    if (searchTerm) {
      newEventList = newEventList.filter(event => JSON.stringify(event).toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedDate !== null && isValid(new Date(selectedDate))) {
      newEventList = newEventList.filter(({datetime}) => isSameDay(new Date(datetime), new Date(selectedDate)))
    }

    setFullEventList(newEventList)
    setVisibleEventList(newEventList.slice(0, loadMoreSize))
  }, [searchTerm, selectedCategory, eventType, selectedDate, allScheduledData, allAnytimeData, loadMoreSize])

  useEffect(() => { // setSelectedCategory
    setSelectedCategory('all')
  }, [categoryOptions])

  useEffect(() => { // setCategoryOptions
    if (eventType === 'scheduled') {
      setCategoryOptions(scheduledCategoryOptions)
    }

    if (eventType === 'anytime') {
      const anytimeCategoryOptions = [...new Set(allAnytimeData.map(event => event.category))].map(category => {
        return {id: category, label: category}
      })

      anytimeCategoryOptions.unshift({id: 'all', label: 'All'})

      setCategoryOptions(anytimeCategoryOptions)
    }
  }, [eventType, allScheduledData, allAnytimeData, loadMoreSize])

  useEffect(() => { // setHasMoreResults
    setHasMoreResults(visibleEventList.length < fullEventList.length)
  }, [visibleEventList, fullEventList])

  useEffect(() => {
    setSelectedDate('')
  }, [eventType])

  const onSearch = value => {
    setSearchTerm(value)
  }

  const onCategoryChange = newValue => {
    setSelectedCategory(newValue)
  }

  const onEventTypeChange = newValue => {
    setEventType(newValue)
  }

  const onDateSelect = newValue => {
    setSelectedDate(newValue)
  }

  const onLoadMore = () => {
    setVisibleEventList(visibleEventList.concat(fullEventList.slice(visibleEventList.length, visibleEventList.length + loadMoreSize)))
  }

  return (
    <div className="event-list-component">
      <div className="nav">

        <div className="list-controls">
          <div className="control">
            <Input.Search
              placeholder="Search"
              onSearch={onSearch}
              disabled={isLoading}
              style={{minWidth: '160px'}}
            />
          </div>
          <Select
            defaultValue="all"
            value={selectedCategory}
            onChange={onCategoryChange}
            disabled={isLoading}
            style={{minWidth: '140px'}}
            className="control"
          >
            {categoryOptions.map(category =>
              <Select.Option key={category.id} value={category.id}>{category.label}</Select.Option>
            )}
          </Select>
          <Select
            defaultValue="scheduled"
            onChange={onEventTypeChange}
            disabled={isLoading}
            style={{minWidth: '100px'}}
            className="control"
          >
            <Select.Option key="scheduled" value="scheduled">Scheduled</Select.Option>
            <Select.Option key="anytime" value="anytime">Anytime</Select.Option>
          </Select>
          {eventType === 'scheduled' &&
            <DatePicker
              value={selectedDate}
              onChange={onDateSelect}
              format="M/D"
              placeholder="Date"
              disabled={isLoading}
              style={{maxWidth: '90px'}}
              className="control"
            />
          }
        </div>

        <Link to="contribute">
          <Button type="primary">Contribute</Button>
        </Link>

      </div>

      <React.Fragment>
        <Media queries={{small: '(max-width: 991px)', large: '(min-width: 992px)'}}>
          {matches => (
            <React.Fragment>
              {matches.small && <CardListComponent isLoading={isLoading} eventList={isLoading ? skeletonData : visibleEventList}/>}
              {matches.large && <ListComponent isLoading={isLoading} eventList={isLoading ? skeletonData : visibleEventList}/>}
            </React.Fragment>
          )}
        </Media>
        {hasMoreResults &&
          <div style={{textAlign: 'center', marginTop: '8px'}}>
            <Button onClick={onLoadMore} disabled={isLoading}>Load More</Button>
          </div>
        }
      </React.Fragment>
    </div>
  )
}

function ListComponent({isLoading, eventList}) {
  return (
    <List
      className="list-component"
      dataSource={eventList}
      itemLayout="horizontal"
      renderItem={({id, datetime, activity, host, details, kidFriendly, link}) =>
        <List.Item
          key={id}
          extra={(!isLoading &&
            <div className="extra">
              {datetime && <div className="when">{format(new Date(datetime), 'eee, MMM d, h:mm aaaa')}</div>}
              <Button type="link" href={link} target="_blank" rel="noopener noreferrer">Website</Button>
              {datetime &&
                <Button
                  type="link"
                  style={{marginLeft: '20px'}}
                  href={createCalendarLink({activity, datetime, host, details, kidFriendly, link})}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add to <CalendarTwoTone />
                </Button>
              }
            </div>
          )}
        >
          <Skeleton loading={isLoading} active title>
            <List.Item.Meta
              title={(
                <div className="title">
                  <Button type="link" href={link} target="_blank" rel="noopener noreferrer">{activity}
                  &nbsp;
                  </Button> <span className="host">by {host}</span>
                  <div className="badges">
                    {kidFriendly && <Badge text="Kid Friendly" color="green"/>}
                  </div>
                </div>
              )}
              description={(
                <div className="description">
                  <p className="details">{details}</p>
                </div>
              )}
            />
          </Skeleton>
        </List.Item>
      }
    />
  )
}

function CardListComponent({isLoading, eventList}) {
  return (
    <div className="card-list-component">
      <Layout>
        <Row gutter={[12, 12]}>
          {eventList.map(event =>
            <Col key={event.id} xs={24} sm={24} md={12}>
              <CardComponent event={event} isLoading={isLoading}/>
            </Col>
          )}
        </Row>
      </Layout>
    </div>
  )
}

function CardComponent({isLoading, event}) {
  const {activity, host, datetime, details, kidFriendly, link} = event

  const Title = () => (
    <a href={link} target="_blank" rel="noopener noreferrer">{activity} <span><LinkOutlined/></span></a>
  )

  if (isLoading) {
    return <div style={{paddingTop: '4px'}}><Skeleton loading={isLoading} active title/></div>
  }

  return (
    <Card className="card-component" title={<Title/>} size="small">
      <div className="badges">
        {kidFriendly && <Badge text="Kid Friendly" color="green"/>}
      </div>
      <p className="host">Hosted by <strong>{host}</strong></p>
      <p className="details">{details}</p>
      <div className="extra">
        {datetime &&
          <a
            className="add-to-cal-link"
            href={createCalendarLink({activity, datetime, host, details, kidFriendly, link})}
            target="_blank"
            rel="noopener noreferrer"
          >
            Add to <CalendarTwoTone />
          </a>
        }
        {datetime && <p className="when">{format(new Date(datetime), 'eee, MMM d, h:mm aaaa')}</p>}
      </div>
    </Card>
  )
}

function createCalendarLink({activity, datetime, details, host, kidFriendly, link}) {
  const startDateTime = format(new Date(datetime), 'yyyyMMdd') + 'T' + format(new Date(datetime), 'HHmmss')
  const endDateTime = format(addHours(new Date(datetime), 1), 'yyyyMMdd') + 'T' + format(addHours(new Date(datetime), 1), 'HHmmss')
  const website = `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`

  const description = `<p>${website}</p> <p>${details}</p> ${kidFriendly ? `<p><b>Kid Friendly</b></p>` : ''} <p>Host: ${host}</p>`

  return 'http://www.google.com/calendar/render' +
    `?action=TEMPLATE` +
    `&text=${activity}` +
    `&dates=${startDateTime}/${endDateTime}` +
    `&details=${description}`
}

export default EventListComponent
