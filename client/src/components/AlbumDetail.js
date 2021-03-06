// Example of component you can copy/paste to create new components


import React, { Component } from 'react';
import {Container, Jumbotron,Button,Col, Form, FormGroup, Label, Input, Collapse, Card, CardBody, FormText, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
//import { Route, Switch, NavLink, Link } from 'react-router-dom';
import api from '../api';
// import './Sample.css';

class AlbumDetail extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);

    this.state = {
      collapseAllPage: true,
      collapseNewPage: true,
      album: null
    }
  }
  toggle() {
    this.setState({ collapseAllPage: !this.state.collapseAllPage,
      collapseNewPage: !this.state.collapseNewPage });
  }

  handleAddPage(){
    api.postPage(this.props.match.params.albumId)
    .then((data) => {
      console.log("PAGE ADDED", data);
      this.getCurrentAlbumFromAPI()
    })
    .catch(err => console.log(err))
  }
  
  handleDelete(albumId,pageId) {
    console.log(albumId,pageId);
    
    api.deletePage(albumId,pageId)
    .then(data =>
       console.log(data))
       this.setState({
        album: {
          ...this.state.album,
          _pages: this.state.album._pages.filter(page =>page._id !== pageId)
        }
      })
   
  }

  handleInputChange(pageField, i, event) {
    console.log(pageField, i, event);

    console.log(this.state.album);
    
    
    let newPages = this.state.album._pages.slice()
    newPages[i] = {
      ...newPages[i],
      [pageField]: event.target.value
    }
    this.setState({
      album: {
        ...this.state.album,
        _pages: newPages
      }
    }, () => {
      let page = this.state.album._pages[i]
      api.savePage(this.props.match.params.albumId, page._id, page)
    })

  }

  getCurrentAlbumFromAPI() {
    api.getAlbum(this.props.match.params.albumId)
    .then(album => {
      this.setState({
        album
      })
    })

  }

  componentDidMount() {
    this.getCurrentAlbumFromAPI()
  }
  render() {
    // let pageId = this.state.album._pages._id
   let albumId = this.props.match.params.albumId;
    console.log("pageid", this.state);
    
    if (!this.state.album)
      return "Loading..."
    console.log('props',this.props)
    let title=this.props.title;               
    return (
      <div className="AlbumDetail">
        <Container>
         
         <h1> {this.state.album.title} </h1> <br/>
       
          {/* <div className='new-page'> */}
          <Button color="danger" onClick={this.handleAddPage.bind(this)} style={{ marginBottom: '1rem' }}>New page</Button>
          {/* <Collapse isOpen={this.state.collapseNewPage}>
          {/* <Card>
            <CardBody>
                
             <form>
           <input type="text" placeholder='title' name='title' value='aa' onChange={(e) => {this.handleInputChange(e)}} /> <br/>
        </form>
            </CardBody>
          </Card> */}
        {/* </Collapse>  */}

          {/* </div> */}

          <div className="page-list">

         <Button color="danger" onClick={this.toggle} style={{ marginBottom: '1rem' }}>List all pages</Button>

         <Collapse isOpen={this.state.collapseAllPage}>
          {this.state.album._pages.map((page, i) =>
            <Jumbotron key={i}>
              <Button color='danger'style={{float: 'right' }} onClick={(e) => {this.handleDelete(albumId, page._id, e)}} >X</Button>
                          <br />
              Date :{page.date}
             Title: 
             <Input type="text" name="title" value={ page.title} id="exampleText" onChange={(e) => {this.handleInputChange("title", i, e)}} />
             <br/>
            
              <hr/>
              Text: <Input type="textarea" name="text" value={ page.text} id="example" onChange={(e) => {this.handleInputChange("text", i, e)}} />
              {/* <Button color='danger'onClick={(e) => {this.handleDelete(albumId, page._id, e)}} >X</Button> */}
           </Jumbotron>
          ).slice().reverse()}
         </Collapse>
         </div>
        </Container>
      </div>
    );
  }
}

export default AlbumDetail;
