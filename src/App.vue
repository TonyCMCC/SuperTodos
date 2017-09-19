<template>
	<div id="app">
		<section class="todoapp" v-cloak>
			<header class="header">
				<h1>超级Todos</h1>
				<input class="new-todo" v-model = "newTodo" @keyup.enter="addTodo" @keyup.esc="cancelAdd"autofocus autocomplete="off" placeholder="需要做的事项?" >
			</header>
			<section class="main" >
				<input class="toggle-all" type="checkbox" >
				<ul class="todo-list">
					<li class="todo" v-for="todo in filteredTodos" :key="todo.id" :class="{editing: todo == editedTodo }">
						<div class="view">
							<input class="toggle" type="checkbox" v-model="todo.completed">
							<label @dblclick="editTodo(todo)" draggable="true">{{ todo.title }}<span style="vertical-align:sub;" class="date">{{todo.createdate|moment}}</span></label>
							<button class="destroy" @click="removeTodo(todo)"></button>
						</div>
						<input class="edit" v-model="todo.title" type="text" @keyup.enter="doneEdit(todo)"
						@keyup.esc="cancelEdit(todo)" @blur="doneEdit(todo)" v-todo-focus="todo == editedTodo">
					</li>
				</ul>
			</section>
			<footer class="footer" v-show="todos.length">
				<span class="todo-count">
					<strong >剩余{{remaining}}个事项未完成</strong>
				</span>
				<ul class="filters" custSelect = "all">
					<li><router-link to="/all" :class="{ selected: visibility == 'all' }">全部</router-link></li>
					<li><router-link to="/active" :class="{ selected: visibility == 'active' }">活动中</router-link></li>
					<li><router-link to="/completed" :class="{ selected: visibility == 'completed' }">已完成</router-link></li>					
				</ul>				
			</footer>
		</section>
		<footer class="info">
			<p ><span class="fileinput-button ">
				<span class="mint-button mint-button--primary mint-button--small">导入</span>
				<input type="file" @change="ImportData($event)" accept="text/plain" />
			</span>
			<mt-button size="small" @click="ExportData()" type="primary" style="margin:0px 10px 0px 0px">导出</mt-button>				
			</p>
			<p>双击编辑事项</p>
			<p>Written by Tony</p>
			<p>Thanks to TodoMVC</p>
		</footer>
	</div>
</template>
<script>
import { Toast, MessageBox,Checklist } from 'mint-ui';

let moment = require('moment');
//全局函数
//存储函数，保存项目事项
var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
	fetch: function () {
		var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		todos.forEach(function (todo, index) {
			todo.id = index
		})
		todoStorage.uid = todos.length
		return todos
	},
	save: function (todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
	}
}
// visibility filters
// 使用es6语法,进行数组过滤筛选
var filters = {
	all(todos) {
		return todos
	},
	active(todos) {
		return todos.filter((todo) =>{
			return !todo.completed
		})
	},
	completed(todos) {
		return todos.filter((todo)=> {
			return todo.completed
		})
	}
}
export default {
	name: 'app',
	data(){
		return {
			todos:todoStorage.fetch(),
			newTodo:'',
			editedTodo:'',
			todoClass:['个人','工作']
		}
	},
  //html 中调用的方法定义
  methods:{
  		addTodo() {
  		var value = this.newTodo && this.newTodo.trim()
  			if (!value) {
  			return
  			}
  			let myDate = new Date()
	  		this.todos.push({
	  			id: todoStorage.uid++,
	  			title: value,
	  			completed: false,
	  			createdate:myDate
	  		})
	  		this.newTodo = null
	  	},
	  	cancelAdd(){
	  		this.newTodo=''
	  	},
	  	removeTodo(todo) {
	  		MessageBox.confirm("是否要删除\""+todo.title+"\"").then(action=>
	  		{
	  			this.todos.splice(this.todos.indexOf(todo), 1)
	  		}
	  		)
	  	},
	  editTodo(todo) {
	  	this.beforeEditCache = todo.title
	  	this.editedTodo = todo
	  },
	  doneEdit(todo) {
	  	if (!this.editedTodo) {
	  		return
	  	}
	  	this.editedTodo = null
	  	todo.title = todo.title.trim()
	  	if (!todo.title) {
	  		this.removeTodo(todo)
	  	}
	  },
	  cancelEdit() {
	  	this.editedTodo = null
	  	todo.title = this.beforeEditCache
	  },
	  ExportData(){
	  	if(this.todos.length==0) return

	  	//定义文件内容，类型必须为Blob 否则createObjectURL会报错	

	  	let content = new Blob([JSON.stringify(this.todos)])

	  	//生成url对象
	  	let  urlObject = window.URL || window.webkitURL || window	
	  	let url = urlObject.createObjectURL(content)	

	  	//生成<a></a>DOM元素
	  	let el = document.createElement('a')
	  	//链接赋值
	  	el.href = url
	  	el.download ="todo文件导出.txt"

	  	//必须点击否则不会下载
	  	el.click()		
	  	//移除链接释放资源		
	    urlObject.revokeObjectURL(url)
	  },
	  ImportData(e){
	  	let files = event.target.files
	  	if (files.length) {
            var file = files[0];
             var reader = new FileReader();//new一个FileReader实例
             if (/text+/.test(file.type)) {//判断文件类型，是不是text类型
                reader.onload = function() {//定义加载函数，并不执行
                	let readTodo=JSON.parse(this.result) 
                    todoStorage.save(readTodo)      //先将数据保存
                    this.todos=todoStorage.fetch()
                    console.log(this.todos)
                }
                reader.readAsText(file)  //加载，并调用上面定义的函数
            }
        }
	  }
	},
	watch: {
		todos: {
			handler: function (todos) {
				todoStorage.save(todos)
			},
			deep: true
		}
	},
	directives: {
		'todo-focus': function (el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	},
	computed: {
		filteredTodos() {
			if (filters[this.visibility]){
				return filters[this.visibility](this.todos)
			}
			else return this.todos
		},
		remaining () {
			return filters.active(this.todos).length
		},
		visibility(){
			return this.$route.path.replace(/\/?/, '')
		}
	},
	filters:{
		moment(value, formatString) {
		formatString = formatString || 'YYYY/MM/DD';
		if (value){
			return moment(value).format(formatString)
		}
		else return null
	}
	}
}
</script>
