import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 12;
  selLat: any;
  selLng: any;
  locName: any;
  geocoder: any;

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
        color: 'orange',
      },
      mapboxgl: mapboxgl,
    });
    document
      .getElementById('search')
      .appendChild(this.geocoder.onAdd(this.map));
    this.getCoordinates();
  }

  getCoordinates() {
    this.geocoder.on('result', (e) => {
      let res = e.result;
      // console.log(e.result);
      this.selLat = res.geometry.coordinates[1];
      this.selLng = res.geometry.coordinates[0];
      this.locName = res.place_name;

      //Adds marker
      // const marker = new mapboxgl.Marker({
      //   draggable: true,
      //   color: 'red',
      // })
      // .setLngLat(e.result.center)
      // .addTo(this.map)
      // console.log('e.result.center',e.result.center)
      // marker.on('dragend',function(e){
      //   var lngLat = e.target.getLngLat();
      //   console.log(lngLat['lat'])
      //   console.log(lngLat['lng'])
      // })
    });
    // console.log(this.selLat,this.selLng,this.locName)
  }
}
