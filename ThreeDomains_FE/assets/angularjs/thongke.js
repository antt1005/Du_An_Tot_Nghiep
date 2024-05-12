window.ThongKeController = function($scope, $http, $location){
    document.getElementById('hoadon').checked = true;
    var today = new Date().toISOString().split('T')[0];
    document.getElementById("tungay").max = today;
    document.getElementById("denngay").max = today;
$scope.ngay = {};
    $http.get("http://localhost:8080/api/bill/gettkngay").then(function(ngay){
        $scope.ngay = ngay.data;
    })

    $scope.thang = {};
    $http.get("http://localhost:8080/api/bill/gettkthang").then(function(thang){
        $scope.thang = thang.data;
    })
    $scope.slthang = {};
    $http.get("http://localhost:8080/api/bill/gettkslthang").then(function(thang){
        $scope.slthang = thang.data;
    
    })

    $scope.tkslhd = [];
    $scope.thongKe = function(){
        document.getElementById('myChart').innerHTML = '';
        var tungay = document.getElementById("tungay").value;
        var denngay = document.getElementById("denngay").value;
        if(tungay == ''){
            Swal.fire("Vui lòng chọn từ ngày","","error");
            return;
        }
        if(denngay == ''){
            Swal.fire("Vui lòng chọn đến ngày","","error");
            return;
        }
        var startDate = new Date(tungay);
        var endDate = new Date(denngay);
        if(startDate > endDate){
            Swal.fire("Từ ngày phải trước đến ngày","","error");
            return;
        }


      if(document.getElementById('hoadon').checked == true){
        document.getElementById("tkhd").style.display = "block";
        document.getElementById("tksp").style.display = "none";
        $http.get("http://localhost:8080/api/bill/gettksoluonghd?tungay="+tungay+"&denngay="+denngay+"").then(function(resp){
            $scope.tkslhd = resp.data


               // Your date range
               document.getElementById('tksp').style.display = 'none';
   var startDate = new Date(tungay);
   var endDate = new Date(denngay);

   // Function to get an array of dates between two dates
   function getDates(startDate, endDate) {
       var dates = [];
       var currentDate = startDate;
       while (currentDate <= endDate) {
           dates.push(currentDate);
           currentDate = new Date(currentDate);
           currentDate.setDate(currentDate.getDate() + 1);
       }
       return dates;
   }

   // Generate an array of dates
   var dateArray = getDates(startDate, endDate);

   // Format dates as labels
   $scope.labels = dateArray.map(function (date) {
       return date.toLocaleDateString('en-GB'); // You can customize the date format
   });
    var columnData = $scope.tkslhd.map(function(item) {
        return item["numberOfBillsStatus0"];
    });
    var columnData1 = $scope.tkslhd.map(function(item) {
        return item["numberOfBillsStatus1"];
    });
    var columnData2 = $scope.tkslhd.map(function(item) {
        return item["numberOfBillsStatus2"];
    });
    var columnDat3 = $scope.tkslhd.map(function(item) {
        return item["numberOfBillsStatus3"];
    });
    var columnData4 = $scope.tkslhd.map(function(item) {
        return item["numberOfBillsStatus4"];
    });
    destroyChart();
       // Cấu hình dữ liệu cho biểu đồ Combo
       var config = {
        type: 'bar', // Loại biểu đồ cho số lượng đã bán
        data: {
            labels: $scope.labels,
            datasets: [{
                label: 'Số lượng chờ xác nhận',
                data: columnData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                }
            },
            tooltips: {
                callbacks: {
                    label: function(context) {
                        return 'Số lượng: ' + context.parsed.y;
                    }
                }
            }
        }
    };

    // Lấy thẻ canvas và vẽ biểu đồ số lượng đã bán
    var ctx = document.getElementById('myChart').getContext('2d');
    var myComboChart = new Chart(ctx, config);

    // Thêm dữ liệu doanh thu vào biểu đồ Combo
    config.type = 'line'; // Chuyển sang loại đồ thị đường
    config.data.datasets.push({
        label: 'Số lượng chờ giao hàng',
        data: columnData1,
        backgroundColor : 'rgba(159, 0, 207,1)',
        borderColor: 'rgba(159, 0, 207, 1)',
        borderWidth: 2,
        fill: false 
    });
      // Thêm dữ liệu doanh thu vào biểu đồ Combo
      config.type = 'line'; // Chuyển sang loại đồ thị đường
      config.data.datasets.push({
          label: 'Số lượng đang giao hàng',
          data: columnData2,
          backgroundColor : 'rgba(24, 138, 229, 1)',
          borderColor: 'rgba(24, 138, 229, 1)',
          borderWidth: 2,
          fill: false // Không tô màu dưới đường doanh thu
      });
      // Thêm dữ liệu doanh thu vào biểu đồ Combo
      config.type = 'line'; // Chuyển sang loại đồ thị đường
      config.data.datasets.push({
          label: 'Số lượng đã giao hàng',
          data: columnDat3,
          backgroundColor : 'rgba(206, 189, 20, 1)',
          borderColor: 'rgba(206, 189, 20, 1)',
          borderWidth: 2,
          fill: false
      });

      // Thêm dữ liệu doanh thu vào biểu đồ Combo
      config.type = 'line'; // Chuyển sang loại đồ thị đường
      config.data.datasets.push({
          label: 'Số lượng đã hủy',
          data: columnData4,
          backgroundColor : 'rgba(255, 0, 20, 1)',
          borderColor: 'rgba(255, 0, 20, 1)',
          borderWidth: 2,
          fill: false
      });
    // Vẽ lại biểu đồ với dữ liệu mới
    myComboChart.update();
    // drawChart($scope.labels, columnData);
    $http.get("http://localhost:8080/api/bill/gettksoluonghdstatus?tungay="+tungay+"&denngay="+denngay +"").then(function(tkhd){
        $scope.hdstatus = tkhd.data;
        console.log($scope.hdstatus);
    })


        })
      }else{
        $http.get("http://localhost:8080/api/bill/gettksoluongsp?tungay="+tungay+"&denngay="+denngay+"").then(function(resp) {
            $scope.tkslhd1 = resp.data;
        document.getElementById('tksp').style.display = 'block';
        document.getElementById('tkhd').style.display = 'none';
            // Your date range
            var startDate = new Date(tungay);
            var endDate = new Date(denngay);
        
            // Function to get an array of dates between two dates
            function getDates(startDate, endDate) {
                var dates = [];
                var currentDate = startDate;
                while (currentDate <= endDate) {
                    dates.push(currentDate);
                    currentDate = new Date(currentDate);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return dates;
            }
        
            // Generate an array of dates
            var dateArray = getDates(startDate, endDate);
        
            // Format dates as labels
            $scope.labels = dateArray.map(function(date) {
                return date.toLocaleDateString('en-GB'); // You can customize the date format
            });
        
            var columnData = $scope.tkslhd1.map(function(item) {
                return item["soLuong"];
            });
            var columnData1 = $scope.tkslhd1.map(function(item) {
                return item["doanhThu"];
            });
            $scope.tongSL = 0;
            for(let i = 0 ; i < columnData.length; i++) {
                $scope.tongSL += columnData[i];
            }
            $scope.tongDT = 0;
            for(let i = 0 ; i < columnData1.length; i++) {
                $scope.tongDT += columnData1[i];
            }
        
            destroyChart();
        
            // Cấu hình dữ liệu cho biểu đồ Combo
            var config = {
                type: 'bar', // Loại biểu đồ cho số lượng đã bán
                data: {
                    labels: $scope.labels,
                    datasets: [{
                        label: 'Số lượng đã bán',
                        data: columnData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        zoom: {
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'xy',
                            }
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function(context) {
                                return 'Số lượng: ' + context.parsed.y;
                            }
                        }
                    }
                }
            };
        
            // Lấy thẻ canvas và vẽ biểu đồ số lượng đã bán
            var ctx = document.getElementById('myChart').getContext('2d');
            var myComboChart = new Chart(ctx, config);
        
            // Thêm dữ liệu doanh thu vào biểu đồ Combo
            config.type = 'line'; // Chuyển sang loại đồ thị đường
            config.data.datasets.push({
                label: 'Doanh thu',
                data: columnData1,
                backgroundColor : 'rgba(159, 0, 207,1)',
                borderColor: 'rgba(159, 0, 207, 1)', // Màu sắc của đường doanh thu
                borderWidth: 2,
                fill: false // Không tô màu dưới đường doanh thu
            });
        
            // Vẽ lại biểu đồ với dữ liệu mới
            myComboChart.update();
        });
        
      }
        
    }
    function destroyChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var existingChart = Chart.getChart(ctx);
    
        // Check if the chart exists and destroy it
        if (existingChart) {
            existingChart.destroy();
        }
    }

    // Function to draw the chart
function drawChart(labels, columnData) {
    // Chart.js configuration
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng hóa đơn',
                data: columnData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                }
            }
        }
       
    
        
    });
   
}
// document.getElementById("tkhd").style.display = 'block';
// Lấy ngày hôm nay
var endDate = moment();

// Lấy startDate là 1 tuần trước
var startDate = moment().subtract(7, 'days');

// Định dạng ngày theo yêu cầu
var formattedEndDate = endDate.format('YYYY/MM/DD');
var formattedStartDate = startDate.format('YYYY/MM/DD');


$http.get("http://localhost:8080/api/bill/gettksoluonghd?tungay="+formattedStartDate+"&denngay="+formattedEndDate+"").then(function(resp){
    $scope.tkslhd = resp.data
       // Your date range
var startDate = new Date(formattedStartDate);
var endDate = new Date(formattedEndDate);

// Function to get an array of dates between two dates
function getDates(startDate, endDate) {
var dates = [];
var currentDate = startDate;
while (currentDate <= endDate) {
   dates.push(currentDate);
   currentDate = new Date(currentDate);
   currentDate.setDate(currentDate.getDate() + 1);
}
return dates;
}

// Generate an array of dates
var dateArray = getDates(startDate, endDate);

// Format dates as labels
$scope.labels = dateArray.map(function (date) {
return date.toLocaleDateString('en-GB'); // You can customize the date format
});
var columnData = $scope.tkslhd.map(function(item) {
    return item["numberOfBillsStatus0"];
});
var columnData1 = $scope.tkslhd.map(function(item) {
    return item["numberOfBillsStatus1"];
});
var columnData2 = $scope.tkslhd.map(function(item) {
    return item["numberOfBillsStatus2"];
});
var columnDat3 = $scope.tkslhd.map(function(item) {
    return item["numberOfBillsStatus3"];
});
var columnData4 = $scope.tkslhd.map(function(item) {
    return item["numberOfBillsStatus4"];
});
destroyChart();
   // Cấu hình dữ liệu cho biểu đồ Combo
   var config = {
    type: 'bar', // Loại biểu đồ cho số lượng đã bán
    data: {
        labels: $scope.labels,
        datasets: [{
            label: 'Số lượng chờ xác nhận',
            data: columnData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                }
            }
        },
        tooltips: {
            callbacks: {
                label: function(context) {
                    return 'Số lượng: ' + context.parsed.y;
                }
            }
        }
    }
};

// Lấy thẻ canvas và vẽ biểu đồ số lượng đã bán
var ctx = document.getElementById('myChart').getContext('2d');
var myComboChart = new Chart(ctx, config);

// Thêm dữ liệu doanh thu vào biểu đồ Combo
config.type = 'line'; // Chuyển sang loại đồ thị đường
config.data.datasets.push({
    label: 'Số lượng chờ giao hàng',
    data: columnData1,
    backgroundColor : 'rgba(159, 0, 207,1)',
    borderColor: 'rgba(159, 0, 207, 1)',
    borderWidth: 2,
    fill: false 
});
  // Thêm dữ liệu doanh thu vào biểu đồ Combo
  config.type = 'line'; // Chuyển sang loại đồ thị đường
  config.data.datasets.push({
      label: 'Số lượng đang giao hàng',
      data: columnData2,
      backgroundColor : 'rgba(24, 138, 229, 1)',
      borderColor: 'rgba(24, 138, 229, 1)',
      borderWidth: 2,
      fill: false // Không tô màu dưới đường doanh thu
  });
  // Thêm dữ liệu doanh thu vào biểu đồ Combo
  config.type = 'line'; // Chuyển sang loại đồ thị đường
  config.data.datasets.push({
      label: 'Số lượng đã giao hàng',
      data: columnDat3,
      backgroundColor : 'rgba(206, 189, 20, 1)',
      borderColor: 'rgba(206, 189, 20, 1)',
      borderWidth: 2,
      fill: false
  });

  // Thêm dữ liệu doanh thu vào biểu đồ Combo
  config.type = 'line'; // Chuyển sang loại đồ thị đường
  config.data.datasets.push({
      label: 'Số lượng đã hủy',
      data: columnData4,
      backgroundColor : 'rgba(255, 0, 20, 1)',
      borderColor: 'rgba(255, 0, 20, 1)',
      borderWidth: 2,
      fill: false
  });
// Vẽ lại biểu đồ với dữ liệu mới
myComboChart.update();
// drawChart($scope.labels, columnData);
$http.get("http://localhost:8080/api/bill/gettksoluonghdstatus?tungay="+startDate+"&denngay="+endDate +"").then(function(tkhd){
    $scope.hdstatus = tkhd.data;
})

})

   


    $scope.labels1 = ['Chờ xác nhận', 'Chờ giao hàng', 'Đang giao hàng','Đã giao hàng','Đã Hủy'];
    $scope.data1 = [0,0,0,0,0];
    var getStatusCount = function(status) {
        return $http.get("http://localhost:8080/api/bill/getbystatus/" + status)
            .then(function(response) {
                return response.data.length;
            });
    };
    
    getStatusCount(0)
        .then(function(count) {
            $scope.data1[0] = count;
            return getStatusCount(1);
        })
        .then(function(count) {
            $scope.data1[1] = count;
            return getStatusCount(2);
        })
        .then(function(count) {
            $scope.data1[2] = count;
            return getStatusCount(3);
        })
        .then(function(count) {
            $scope.data1[3] = count;
            return getStatusCount(4);
        })
        .then(function(count) {
            $scope.data1[4] = count;

            var total = $scope.data1.reduce((acc, value) => acc + value, 0);
            $scope.percentages = $scope.data1.map(value => ((value / total) * 100).toFixed(2));
        // Create a new array combining label and percentage
        $scope.labelsWithPercentage = $scope.labels1.map((label, index) => label + ': ' + $scope.percentages[index] + '%');
            // Chart.js configuration for pie chart
            var ctx = document.getElementById('myChart1').getContext('2d');
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: $scope.labelsWithPercentage,
                    datasets: [{
                        data: $scope.percentages,
                        backgroundColor: ['rgba(105, 0, 0, 0.7)', 'rgba(105, 68, 0, 0.7)', 'rgba(72, 105, 0, 0.7)','rgba(0, 105, 74, 0.7)','rgba(0, 68, 105, 0.7)'],
                       
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'My Pie Chart'
                    }
                }
            });
        })

          //load product ban chay
    $scope.listProductSold = [];
    $http.get("http://localhost:8080/api/bill/gettksanpham").then(function (response) {
      $scope.listProductSold = response.data;
    });
    // pagation
    $scope.pagerProductSold = {
      page: 0,
      size: 5,
      get items() {
        var start = this.page * this.size;
        return $scope.listProductSold.slice(start, start + this.size);
      },
      get count() {
        return Math.ceil((1.0 * $scope.listProductSold.length) / this.size);
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
      },
      
    };

  

}