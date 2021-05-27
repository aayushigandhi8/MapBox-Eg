import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 36.778259;
  lng = -119.417931;
  zoom = 12;
  selLat: any;
  selLng: any;
  locName: any;
  geocoder: any;
  geocoder1: any;
  state: any;

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.addMarkers();
  }

  addMarkers() {
    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: 'red',
      },
      countries: 'us',
      filter: function (item) {
        return item.id.split('.').shift() === 'region';
      },
      mapboxgl: mapboxgl,
    });

    document
      .getElementById('search')
      .appendChild(this.geocoder.onAdd(this.map));

    this.geocoder.on('result', (e) => {
      let res = e.result;
      this.state = res.text;
      this.getCounty();
    });
    // this.getCoordinates();
  }

  getCoordinates() {
    // this.geocoder.on('result', (e) => {
    //   let res = e.result;
    //   console.log('geocoder', e.result);
    //   this.selLat = res.geometry.coordinates[1];
    //   this.selLng = res.geometry.coordinates[0];
    //   this.locName = res.place_name;
    //   //Adds marker
    //   // const marker = new mapboxgl.Marker({
    //   //   draggable: true,
    //   //   color: 'red',
    //   // })
    //   // .setLngLat(e.result.center)
    //   // .addTo(this.map)
    //   // console.log('e.result.center',e.result.center)
    //   // marker.on('dragend',function(e){
    //   //   var lngLat = e.target.getLngLat();
    //   //   console.log(lngLat['lat'])
    //   //   console.log(lngLat['lng'])
    //   // })
    // });
  }

  getCounty() {
    const state = this.state;
    this.geocoder1 = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: 'red',
      },
      countries: 'us',
      filter: function (item) {
        console.log('item', item);
        return item.context
          .map(function (i) {
            let a = i.id.split('.').shift() === 'region' && i.text === state;
            return a;
          })
          .reduce(function (acc, cur) {
            return acc || cur;
          });
      },
      mapboxgl: mapboxgl,
    });

    document
      .getElementById('search1')
      .appendChild(this.geocoder1.onAdd(this.map));

    this.geocoder1.on('result', (e) => {
      let res = e.result;
      console.log('county_geo1', e.result);
      this.selLat = res.geometry.coordinates[1];
      this.selLng = res.geometry.coordinates[0];
      this.locName = res.place_name;
    });
  }
}
