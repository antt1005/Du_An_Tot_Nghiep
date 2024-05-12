window.TinTucController = function($scope, $http, $location,$rootScope,$routeParams){

$scope.form = {
    title : '',
    content : ''
}
   $scope.getAll = function(){
    $scope.listNews = [];
    $scope.list = [];
    $http.get("https://beebetanews-default-rtdb.firebaseio.com/news.json").then(function(resp){
        $scope.listNews = resp.data;
  
        for (let key in resp.data) {
            if (resp.data.hasOwnProperty(key)) {
                const value = resp.data[key];
            
        
                var obj = {
                    key: key,
                    value: value
                };
        
                $scope.list.push(obj);
                
            }
        }
               // Chuyển đổi thời gian thành timestamp
$scope.list.forEach(function(item) {
    item.value.timestamp = new Date(item.value.time).getTime();
  });
  
  // Sắp xếp theo timestamp
  $scope.list.sort(function(a, b) {
    return b.value.timestamp - a.value.timestamp;
  });

        
                
      
    })
       // pagation
       $scope.pager = {
        page: 0,
        size: 10,
        get items() {
            var start = this.page * this.size;
            return $scope.list.slice(start, start + this.size);
        },
        get count() {
            return Math.ceil(1.0 * $scope.list.length / this.size);
        },

        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.last();
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.first();
            }
        },
        last() {
            this.page = this.count - 1;
        }
    }
   }
   $scope.getAll();

   $scope.delete = function(key){
    $http.delete("https://beebetanews-default-rtdb.firebaseio.com/news/"+key+".json").then(function(resp){
        Swal.fire("Xóa tin tức thành công !","","success");
        $scope.getAll();
    })
   }
      
  

  
    $scope.add = function(){
        var fileanh = document.getElementById("fileUpload").files;
        if(fileanh.length === 0){
            Swal.fire("Vui lòng thêm ảnh đại diện tin tức !","","error");
            return;
        }
        if($scope.form.title.length === 0 ){
            Swal.fire("Tiêu đề không bỏ trống !","","error");
            return;
        }
        if($scope.form.title.length < 30 ){
            Swal.fire("Tiêu đề nhỏ hơn 30 kí tự !","","error");
            return;
        }
        if($scope.form.content.length === 0 ){
            Swal.fire("Nội dung không bỏ trống !","","error");
            return;
        }


        var filea = fileanh[0];
        var reader = new FileReader();
        var file64;
        reader.onload = function(e){
            console.log(e.target.result);
            $http.post("https://beebetanews-default-rtdb.firebaseio.com/news.json",{
                image : e.target.result,
                title : $scope.form.title,
                content : $scope.form.content,
                time : new Date(),
                user : $rootScope.user.username
            }).then(function(resp){
                Swal.fire("Thêm tin tức mới thành công !","","success");
                location.href = "#/news"
            })
        }
        reader.readAsDataURL(filea);
    }

    $scope.detail = function(){
        var key = $routeParams.key;
        $http.get("https://beebetanews-default-rtdb.firebaseio.com/news/"+key+".json").then(function(resp){
            $scope.form = resp.data;
          
           
        
        })

    }
    $scope.update = function(){
        var key = $routeParams.key;
        var fileanh = document.getElementById("fileUpload").files;
    
        if($scope.form.title.length === 0 ){
            Swal.fire("Tiêu đề không bỏ trống !","","error");
            return;
        }
        if($scope.form.title.length > 50 ){
            Swal.fire("Tiêu đề nhỏ hơn 50 kí tự !","","error");
            return;
        }
        if($scope.form.content.length === 0 ){
            Swal.fire("Nội dung không bỏ trống !","","error");
            return;
        }
        if(fileanh.length > 0){
            var filea = fileanh[0];
            var reader = new FileReader();
            var file64;
            reader.onload = function(e){
                $http.put("https://beebetanews-default-rtdb.firebaseio.com/news/"+key+".json",{
                    image : e.target.result,
                    title : $scope.form.title,
                    content : $scope.form.content,
                    time : new Date(),
                    user : $rootScope.user.username
            }).then(function(resp){
                
            Swal.fire("Sửa tin tức thành công !","","success");
            location.href = "#/news"
               
            
            })
            }
            reader.readAsDataURL(filea);
        }
        else{
            $http.get("https://beebetanews-default-rtdb.firebaseio.com/news/"+key+".json").then(function(resp){
        
            $http.put("https://beebetanews-default-rtdb.firebaseio.com/news/"+key+".json",{
                image : resp.data.image,
                title : $scope.form.title,
                content : $scope.form.content,
                time : new Date(),
                user : $rootScope.user.username
        }).then(function(resp){
            
        Swal.fire("Sửa tin tức thành công !","","success");
        location.href = "#/news"
           
        
        })
               
            
            })
            
           
        }
       
       
    }


}