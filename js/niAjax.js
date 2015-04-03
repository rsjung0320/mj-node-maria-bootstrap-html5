(function($){
  "use strict";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // niAjax
  // niAjax은 jQuery 처럼 $.niAjax()로 사용 할 수 있다.
  // niAjax는 비동기로 동작하기 때문에 .then을 사용하여 성공시에는 첫 번째 param에 success에 관한 값이 넘어오고, 실패 시에는 두 번째 param에 success에 관한 값이 넘어온다.
  // ex) $.niAjax().then(function(success){}, function(error){});
  // ++ 앞으로 해야 할 것
  // 현재는 한가지 작업에 관한 내용만 작성 되어 있지만, 한번 통신 후 그 해당 값에 의해 다시 서버로 보내는 경우에 관하여 클라이언트에서 사용 가능하지만 여기에서 그러한 동작들을 할 수 있도록
  // custom function을 추가할 수 있다.
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Config
  // 127.0.0.1
  var SERVER_URL = null;
  // GET, POST, etc..
  var TYPE = null;
  // 서버로 부터 받는 타입, json, jsonp, etc..          
  var DATATYPE = null;
  // error message
  var ERRORMSG = null;



  // @param _config
  // type : object
  // @param _data : 서버로 보내는 데이터
  // type : object
  // @param _file : 파일 서버로 보낼 때의 담겨지는 file object
  // type : dafalut = json, f or F = formData // 추가로 필요한 방식이 있으면 이야기 하도록.(예. xml 등)
  $.niAjax = (function( _config, _data, _type ){   

    // async Start!
    var dfd = $.Deferred();

    (function niAjaxProcess(){

      if( _config != null && _config != undefined )
      {
        // config setting
        configSetting(_config);

        if( _data != null && _data != undefined )
        {
          var data = serializeData(_data, _type);
          console.log('data : ', data);
          generalAjax(data);
        }
        else
        {
          ERRORMSG = 'error'
          dfd.reject(ERRORMSG);
        }
      }
      else
      {
        ERRORMSG = 'config not available';
        dfd.reject(ERRORMSG);
      }
    })();

    // config setting function
    // @param _config 
    // type: object
    function configSetting(_config){
      // 앞으로 해야 할 것은..
      // http 통신에 있어 특정 헤더가 필요 할 경우에 어떻게 처리 할지 회의 후에 결정 하도록 한다.
      
      SERVER_URL = _config.url;
      TYPE = _config.type;
      DATATYPE = _config.dataType;
    }

    // data를 json 인지 formData인지 판별 후 해당 data에 맞게 serialize 함
    // @param _data 
    // type: object
    // @param _type 
    // type: string
    // return: object
    function serializeData(_data, _type){
      var data = null;
      
      // formData로 전환하여 보내 준다.
      if( _type === 'f' || _type === 'F' )
      {
        var tempData = new FormData();

        // _data가 비어 있지 않다면
        if( isObjectEmpty(_data) != true )
        {
          data = convertFormData(_data);
        }
        else
        {
          ERRORMSG = 'No Data'
          dfd.reject(ERRORMSG);
        }
      }
      // defalut는 json
      else
      {
        data = _data;
      }

      return data;
    }

    // object에 값에 비었는지 확인하는 function
    // @param obj 
    // type: object
    // return: true | false
    function isObjectEmpty(obj){
      var isEmpty = true;

      for(var keys in obj)
      {
         isEmpty = false;
         break; // exiting since we found that the object is not empty
      }
      return isEmpty;
    }

    // object에서 FormData로 변환하는 function
    // @param obj 
    // type: object
    // return: FormData
    function convertFormData (obj){
      // var isEmpty = true;
      var data = new FormData();
      var keys = [];
      console.log('obj : ', obj);

      for(var key in obj)
      {
        keys.push(key);
      }
      for(var i=0; i < keys.length; i++)
      {
        // console.log('key : ', keys[0]);
        // console.log('value : ', obj[keys[0]]);
        data.append(key, obj[keys[0]]);
      }

      return data;
    }
   
    // formdata와 json 둘 다 보낼 수 있도록 한다.
    // 아마 data에 담는거니, 보내는 쪽에서 알아서 잘하면 될 듯.

    // 파일 이외의 통신할 때 사용 한다.
    // @param _data 
    // type: object
    function generalAjax(_data)
    {
      $.ajax({
        url: SERVER_URL,
        type: TYPE,
        dataType: DATATYPE,
        data: _data,
        processData: false,
        contentType: false,
        success: dfd.resolve,
        error: dfd.reject 
      });
    }
    
    ///////////////////////////////////////////////////////
    // 추후 개발 할 것들
    ///////////////////////////////////////////////////////

    // 파일 서버를 WAS와 같이 두지 않고 파일 서버를 별도로 구성할 경우, userID나 session ID를 header에 추가로 보내주어 인증 후에 파일 upload, download 할 수 있도록 한다.
    // 파일 전송일 경우 function
    // function fileAjax(_file)
    // {
    //   var data = new FormData();
    //   data.append('myFile', _file);

    //   console.log('data : ', data);

    //   $.ajax({
    //     url: SERVER_URL,
    //     type: TYPE,
    //     dataType: DATATYPE,
    //     data: data,
    //     processData: false,
    //     contentType: false,
    //     success: function(value){
    //       console.log('success : ', value);
    //     },
    //     error: function(value){
    //       console.log('error : ', value);
    //     }
    //     // success: dfd.resolve,
    //     // error: dfd.reject 
    //   });
    // }

    //  function fileExtensionCheck(_file){
    //   console.log('file : ', _file);
        
    //   var ext = _file.type.split('/');
     
    //   var file = _file;
    //   var fileSize = null;
    //   var blob = null;
      
    //   switch(ext[0])
    //   {
    //     // 이미지일 경우
    //     case 'image' :
    //         if(_blob != null)
    //         {
    //             blob = _blob;
    //             fileSize = blob.size;
    //         }
    //         else
    //         {
    //             fileSize = file.size;
    //         }
            
    //         break;
    //     // 비디오일 경우
    //     case 'video' : 

    //         break;
    //     // 엑셀, pdf, doc 등 모든 파일             
    //     default :
    //         fileSize = file.size;
    //   }
    // }
    // async End!
    return dfd.promise();
    
  });

  // $.niAjax.download = (function( _url, _data ){
  //   // async Start!
  //   var dfd = $.Deferred();

  //   downloadFile();

  //   function downloadFile()
  //   {
  //     $.ajax({
  //       url: _url,
  //       type: 'GET',
  //       // dataType: 'blob',
  //       // processData: false,
  //       // contentType: false,
  //       success: function(data){
  //         var blob=new Blob([data]);
  //         console.log('blob :', blob);

  //         // var link=document.createElement('a');
  //         // link.href=window.URL.createObjectURL(blob);
  //         // link.download="Dossier_"+new Date()+".pdf";
  //         // link.click();
  //         // window.location = _url;
  //         dfd.resolve();  
  //       },
        
  //       error: dfd.reject 
  //     });
  //   }

  //   // async End!
  //   return dfd.promise();
  // });

})(jQuery);