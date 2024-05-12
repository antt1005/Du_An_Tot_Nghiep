window.KhuyenMaiController = function ($scope, $http, $location, $routeParams) {
   



    console.log($location.path())
    if($location.path() === "/voucher/add"){
        $(document).ready(function(){{
            $("#giamtheobill").prop("checked",true);
        }})
    
        $(document).ready(function(){{
            $("#giamphantram").prop("checked",true);
        }})

        document.getElementById("km").style.display = "block"
        var today = new Date().toISOString().split('T')[0]
        document.getElementById("ngaybatdau").min = today;
        document.getElementById("ngayhethan").min = today;
    }
    

    
   


    

    let url = "http://localhost:8080/api/voucher";
    $scope.selectedVoucherType = 'percentage';
    $scope.loadAll = function () {
        
        // load material
        $scope.list = [];
        $http.get(url).then(function (response) {
            $scope.list = response.data;
        })

    }
    $scope.loadAll();
        $scope.check = function(){
            if(document.getElementById("giamphantram").checked == true){
                document.getElementById("km1").style.display = "block";
                document.getElementById("km").style.display = "none";
            }else{
                document.getElementById("km1").style.display = "none";
                document.getElementById("km").style.display = "block";
            }
            
        }


    // pagation
    $scope.pager = {
        page: 0,
        size: 5,
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

    $scope.form = {
        code: '',
        name: '',
        typeVoucher:'',
        isVoucher:'',
        discount:'',
        cash:'',
        startdate:'',
        enddate:'',
        minimum:'',
    }

    //add
    $scope.add = function(){
        let checkk = true;
        if(document.getElementById("giamtheobill").checked === true){
            checkk = false;
        }
        let checkk2 = true;
        if(document.getElementById("giamtienmat").checked === true){
            checkk2 = false;
        }

        let checkk1 = '';
        if(document.getElementById("giamtienmat").checked === true){
            checkk1 =  $scope.form.cash
           
        }
        else{
            checkk1 = $scope.form.discount;
        }


        if(document.getElementById("giamphantram").checked === true){
            if($scope.form.discount === ''){
                Swal.fire("Giá trị phần trăm giảm không bỏ trống !","","warning")
                return;
            }
        }
        else{
            if($scope.form.cash === ''){
                Swal.fire("Giá trị tiền giảm không bỏ trống !","","warning")
                return;
            }

        }

        let tungay = document.getElementById("ngaybatdau").value;
        let denngay = document.getElementById("ngayhethan").value;

        var startDate = new Date(tungay);
        var endDate = new Date(denngay);
        if(startDate > endDate){
            Swal.fire("Ngày bắt đầu trước ngày hết hạn","","error");
            return;
        }
        
        $http.post(url,{
            code : $scope.form.code,
            name : $scope.form.name,
            typeVoucher : checkk2,
            isVoucher : checkk ,
            discount : checkk1, 
            cash : checkk1,
            startDate : $scope.form.startdate,
            endDate : $scope.form.enddate,
            minimum : 0,
            
        }).then(function(resp){
            if(resp.status === 200){
                Swal.fire('Thêm thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/voucher/view";
                }, 2000);
            }
        }).catch(function (err){
            if (err.status === 400){
                console.log(err.data)
                $scope.validationErrors = err.data;
            }
            
        })
    }

    //update 
    $scope.update = function(){
        var startDate  = document.getElementById("ngaybatdau").value;
        var endDate  = document.getElementById("ngayhethan").value;
        let id = $routeParams.id;
        if( $scope.form.typeVoucher==true){
            $scope.form.cash = null;
        }else{
            $scope.form.discount = null;
        }

        let checkk = true;
        if(document.getElementById("giamtheobill").checked === true){
            checkk = false;
        }
        let checkk2 = true;
        if(document.getElementById("giamtienmat").checked === true){
            checkk2 = false;
        }

        let checkk1 = '';
        if(document.getElementById("giamtienmat").checked === true){
            checkk1 =  document.getElementById("giamtien").value;
           
        }

        if(document.getElementById("giamphantram").checked === true){
            checkk1 =  document.getElementById("giamtram").value;
        }

        if(document.getElementById("giamphantram").checked === true){
            if($scope.form.discount === ''){
                Swal.fire("Giá trị phần trăm giảm không bỏ trống !","","warning")
                return;
            }
        }
        else{
            if($scope.form.cash === ''){
                Swal.fire("Giá trị tiền giảm không bỏ trống !","","warning")
                return;
            }

        }

        let tungay = document.getElementById("ngaybatdau").value;
        let denngay = document.getElementById("ngayhethan").value;

        var startDate = new Date(tungay);
        var endDate = new Date(denngay);
        if(startDate > endDate){
            Swal.fire("Ngày bắt đầu trước ngày hết hạn","","error");
            return;
        }

        console.log(checkk1);
        
        $http.put("http://localhost:8080/api/voucher/update/"+id,{
            code : $scope.form.code,
            name : $scope.form.name,
            typeVoucher : checkk2,
            isVoucher : checkk,
            discount : checkk1,
            cash : checkk1,
            startDate : startDate,
            endDate : endDate,
            minimum : 0,
        }).then(function(resp){
            if(resp.status === 200){
                Swal.fire('Sửa thành công !', '', 'success')
                setTimeout(() => {
                    location.href = "#/voucher/view";
                }, 2000);
            }
        }).catch(function (err){
            if (err.status === 400){
                $scope.validationErrors = err.data;
            }

        })
    }

    $scope.delete = function (id) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa ?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $http.put("http://localhost:8080/api/voucher/delete/" + id).then(function (response) {
                    if (response.status === 200) {
                        Swal.fire('Xóa thành công !', '', 'success')
                        $scope.loadAll();
                    }
                    else {
                        Swal.fire('Xóa thất bại !', '', 'error')
                    }
                })

            }
        })
    }

     // detail khach hang
     $scope.detail = function () {
        let id = $routeParams.id;
        $http.get("http://localhost:8080/api/voucher/" + id).then(function (resp) {
            $scope.form = resp.data;

    
            console.log($scope.form);
            if(resp.data.typeVoucher == true){
                
                // document.getElementById("giamphantram").checked = true;
                // document.getElementById("giamtienmat").checked = false;
                document.getElementById("km").style.display = "block";
                document.getElementById("km1").style.display = "none";
            }else{
                // document.getElementById("giamtienmat").checked = true
                // document.getElementById("giamphantram").checked = false;
                document.getElementById("km").style.display = "none";
                document.getElementById("km1").style.display = "block";
            }
           
            if(resp.data.isVoucher == false){
                $(document).ready(function(){{
                    $("#giamtheobill").prop("checked",true);
                }})
            
               
            }else{
                $(document).ready(function(){{
                    $("#giamtheosp").prop("checked",true);
                }})

            }
            if(resp.data.typeVoucher == true){
                $(document).ready(function(){{
                    $("#giamphantram").prop("checked",true);
                }})
            
               
            }else{
                $(document).ready(function(){{
                    $("#giamtienmat").prop("checked",true);
                }})

            }

            // if(resp.data.typeVoucher == true){
            //     document.getElementById("giamtheobill").checked = true 
            // }else{
            //     document.getElementById("giamsanpham").checked = true
            // }


          
            let dateInput = document.getElementById('ngaybatdau');
    
            // Original datetime string in 'yyyy-MM-dd hh:mm:ss.sss' format
            var originalDateStr = $scope.form.startDate; // Replace with your original date
            if(originalDateStr !== null){
                // Split the original date string
            var dateParts = originalDateStr.split('T')[0].split('-');

            // Extract year, month, and day
            var year = dateParts[0];
            var month = dateParts[1];
            var day = dateParts[2];
            var formattedDate = year + '-' + month + '-' + day;

            // Set the formatted date in the input field'
        
            dateInput.value = formattedDate;
            
            }            
            

////////////////////////////////////////////////////////////////////////////////////////////////
            let dateInput1 = document.getElementById('ngayhethan');

            // Original datetime string in 'yyyy-MM-dd hh:mm:ss.sss' format
            var originalDateStr1 = $scope.form.endDate; // Replace with your original date
            if(originalDateStr1 !== null){
                                      // Split the original date string
            var dateParts1 = originalDateStr1.split('T')[0].split('-');

            // Extract year, month, and day
            var year1 = dateParts1[0];
            var month1 = dateParts1[1];
            var day1 = dateParts1[2];
            var formattedDate1 = year1 + '-' + month1 + '-' + day1;

            // Set the formatted date in the input field'
        
            dateInput1.value = formattedDate1;
                                 }
           
    // Create the formatted d
            
        })

    }
    
    //appear box
    $scope.appear = function () {
       
    }
     //export exel
     $scope.exportToExcel = function () {
        Swal.fire({
            title: 'Bạn có chắc muốn xuất Exel ?',
            showCancelButton: true,
            confirmButtonText: 'Xuất',
        }).then((result) => {
            if (result.isConfirmed) {
                // Chuyển dữ liệu thành một mảng các đối tượng JSON
                var dataArray = $scope.list.map(function (item) {
                    return {
                        Id: item.id,
                        Code: item.code,
                        Name: item.name,
                        typeVoucher: item.typeVoucher,
                        // typeVoucher: item.typeVoucher,
                        isVoucher: item.isVoucher,
                        // isVoucher: item.isVoucher,
                        Discount: item.discount,
                        Cash: item.cash,
                        StartDate: item.startDate,
                        // StartDate: item.startdate,
                        EndDate: item.endDate,
                        // EndDate: item.enddate,
                    };
                });

                // Tạo một workbook mới
                var workbook = XLSX.utils.book_new();

                // Tạo một worksheet từ dữ liệu
                var worksheet = XLSX.utils.json_to_sheet(dataArray);

                // Thêm worksheet vào workbook
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sheet');

                // Xuất tệp Excel
                XLSX.writeFile(workbook, 'data' + new Date() + '.xlsx');
                Swal.fire("Xuất file exel thành công !", "", "success");
            }
        })

    }

     // search by name
     $scope.search = function (){
        var name = document.getElementById("name").value;
        if (name.trim().length === 0){
            $scope.loadAll();
           Swal.fire("Nhập tên trước khi tìm kiếm...","","error");
        }
        else{
            $http.get("http://localhost:8080/api/voucher/search/"+name).then(function (search){
                $scope.list = search.data;
                $scope.pager.first();
            })
        }
    }
}

