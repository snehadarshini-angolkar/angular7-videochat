import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SpeechRecognitionService } from './speech-recognition.service';
declare var Peer: any;
//import * as Peer from 'peerjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('myvideo') myvideo: any;
  @ViewChild('myvideo2') myvideo2: any;

  peer;
  anotherid;
  mypeerid;
  conn;
  video;
  showSearchButton;
  speechData;
  onCall;
  peerConnections = [];
  video2;
  peerStreams = [];
  connections: any;
  tempVideo: any;
  tempId;

  constructor(private speechRecognitionService: SpeechRecognitionService) {
    this.showSearchButton = true;
    this.speechData = "";
  }
  ngOnDestroy() {
    this.speechRecognitionService.destroySpeechObject();
  }
  ngOnInit() {
    this.video = this.myvideo.nativeElement;
    this.peer = new Peer({key: 'lwjd5qra8257b9'});
    setTimeout(() => {
      this.mypeerid = this.peer.id;
    },3000);

    this.peer.on('connection', (conn) => {
      this.peerConnections.push(conn);
      console.log(this.peerConnections);
      /*this.peerConnections.on('data',(data) => {
        console.log(data);
      });*/
    });
    this.peer.on('disconnected', (conn) => {
      console.log(conn);
    });
    this.peer.on('close', (conn) => {
      console.log(conn);
    });
    this.peer.on('destroyed', (conn) => {
      console.log(conn);
    });


    var n = <any>navigator;

    n.getUserMedia =  ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia );

    this.peer.on('call', (call) => {
      n.getUserMedia({video: true, audio: true}, (stream) => {
        call.answer(stream);
        call.on('stream', (remotestream) => {
          const existingStream = this.peerStreams.find((peerstream) => peerstream.id == remotestream.id);
          if (!existingStream) {
            this.peerStreams.push(remotestream);
          }

        })
      }, function(err) {
        console.log('Failed to get stream', err);
      })
    })


  }

  connect(){
    this.conn = this.peer.connect(this.anotherid);
    console.log(this.conn.id);
    this.conn.on('open', () => {
      this.conn.send('Message from that id');
    });
  }
  close() {
    this.onCall = false;
    this.peer.destroy();
    //this.peer.disconnect();
    this.video.srcObject = new MediaStream();
  }

  videoconnect(){
   this.onCall = true;
   this.video = this.myvideo.nativeElement;

   var localvar = this.peer;
    var fname = this.anotherid;

    var n = <any>navigator;

    n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );

    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {

      const call = this.peer.call(this.anotherid, stream);
      call.on('stream', (remoteStream) => {
        this.video.srcObject = remoteStream;
        this.tempVideo = remoteStream;
        this.tempId = this.tempVideo.id;
         return this.video.play();
      });

    }).catch((error) => {
      console.log(error);
    });
    this.activateSpeechSearchMovie();
  }

  activateSpeechSearchMovie(): void {
    //this.showSearchButton = false;

    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.speechData = value;
          console.log(value);
        },
        //errror
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            console.log("--restatring service--");
            this.activateSpeechSearchMovie();
          }
        },
        //completion
        () => {
          this.showSearchButton = true;
          console.log("--complete--");
          this.activateSpeechSearchMovie();
        });
  }

}


