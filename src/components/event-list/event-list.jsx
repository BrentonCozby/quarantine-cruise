import React, {useState, useEffect} from 'react'
import {Card, Button, List, Empty, Layout, Row, Col, Select, DatePicker} from 'antd'
import {Link} from 'react-router-dom'
import {format, add, isAfter, isToday, isValid, isSameDay} from 'date-fns'
import {LinkOutlined, CalendarTwoTone} from '@ant-design/icons'
import Media from 'react-media'
import './event-list.less'

import educationData from 'data/educationData.json'
import artAndMusicData from 'data/artAndMusicData.json'
import fitnessAndWellnessData from 'data/fitnessAndWellnessData.json'
import otherData from 'data/otherData.json'
import anytimeData from 'data/anytimeData.json'

const scheduledCategoryOptions = [
  {id: 'all', label: 'All'},
  {id: 'education', label: 'Education'},
  {id: 'fitnessAndWellness', label: 'Fitness & Wellness'},
  {id: 'artAndMusic', label: 'Art & Music'},
  {id: 'other', label: 'Other'}
]

const allEventsWithDates = [].concat(educationData, artAndMusicData, fitnessAndWellnessData, otherData)
.filter(({datetime}) => isToday(new Date(datetime)) || isAfter(new Date(datetime), new Date()))
.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

function EventListComponent({
  loadMoreSize = 8
}) {
  const [allScheduledData, setAllScheduledData] = useState(allEventsWithDates)
  const [allAnytimeData, setAllAnytimeData] = useState(anytimeData)
  const [fullEventList, setFullEventList] = useState([].concat(allScheduledData.slice(0, loadMoreSize)))
  const [visibleEventList, setVisibleEventList] = useState([].concat(allScheduledData.slice(0, loadMoreSize)))
  const [categoryOptions, setCategoryOptions] = useState(scheduledCategoryOptions)
  const [hasMoreResults, setHasMoreResults] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [eventType, setEventType] = useState('scheduled')
  const [selectedDate, setSelectedDate] = useState(null)

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

    if (selectedDate !== null && isValid(new Date(selectedDate))) {
      newEventList = newEventList.filter(({datetime}) => isSameDay(new Date(datetime), new Date(selectedDate)))
    }

    setFullEventList(newEventList)
    setVisibleEventList(newEventList.slice(0, loadMoreSize))
  }, [selectedCategory, eventType, selectedDate, allScheduledData, allAnytimeData, loadMoreSize])

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

  const onLoadMore = () => {
    setVisibleEventList(visibleEventList.concat(fullEventList.slice(visibleEventList.length, visibleEventList.length + loadMoreSize)))
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

  return (
    <div className="event-list-component">
      <div className="nav">

        <div className="list-controls">
          <Select
            defaultValue="all"
            value={selectedCategory}
            onChange={onCategoryChange}
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
              style={{maxWidth: '90px'}}
              className="control"
            />
          }
        </div>

        <Link to="contribute">
          <Button type="primary">Contribute</Button>
        </Link>

      </div>

      {visibleEventList.length ?
        <React.Fragment>
          <Media queries={{small: '(max-width: 991px)', large: '(min-width: 992px)'}}>
            {matches => (
              <React.Fragment>
                {matches.small && <CardListComponent eventList={visibleEventList}/>}
                {matches.large && <ListComponent eventList={visibleEventList}/>}
              </React.Fragment>
            )}
          </Media>
          {hasMoreResults &&
            <div style={{textAlign: 'center', marginTop: '8px'}}>
              <Button onClick={onLoadMore}>Load More</Button>
            </div>
          }
        </React.Fragment>
        :
        <Empty description="No events or activities available"/>
      }
    </div>
  )
}

function ListComponent({eventList}) {
  return (
    <List
      className="list-component"
      dataSource={eventList}
      itemLayout="horizontal"
      renderItem={({id, datetime, activity, host, details, kidFriendly, link}) =>
        <List.Item
          extra={(
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
          <List.Item.Meta
            title={(
              <div className="title">
                <Button type="link" href={link} target="_blank" rel="noopener noreferrer">{activity}
                &nbsp;
                </Button> <span className="host">by {host}</span>
                <div className="badges"></div>
              </div>
            )}
            description={(
              <div className="description">
                <p className="details">{details}</p>
              </div>
            )}
          />
        </List.Item>
      }
    />
  )
}

function CardListComponent({eventList}) {
  return (
    <div className="card-list-component">
      <Layout>
        <Row gutter={[12, 12]}>
          {eventList.map(event =>
            <Col key={event.id} xs={24} sm={24} md={12}>
              <CardComponent event={event}/>
            </Col>
          )}
        </Row>
      </Layout>
    </div>
  )
}

function CardComponent({event}) {
  const {id, activity, host, datetime, category, details, kidFriendly, link} = event

  const Title = () => (
    <a href={link} target="_blank" rel="noopener noreferrer">{activity} <span><LinkOutlined/></span></a>
  )

  return (
    <Card className="card-component" title={<Title/>} size="small">
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
  const endDateTime = format(add(new Date(datetime), {hours: 1}), 'yyyyMMdd') + 'T' + format(add(new Date(datetime), {hours: 1}), 'HHmmss')

  const description = `<p>${details}</p> ${kidFriendly ? `<p><b>Kid Friendly</b></p>` : ''} <p>Host: ${host}</p> <p>${link}<p/>`

  return 'http://www.google.com/calendar/render' +
    `?action=TEMPLATE` +
    `&text=${activity}` +
    `&dates=${startDateTime}/${endDateTime}` +
    `&details=${description}`
}

export default EventListComponent
