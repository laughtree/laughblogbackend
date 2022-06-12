require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")
const { RANDOM } = require("mysql/lib/PoolSelector")
const { YEAR } = require("mysql/lib/protocol/constants/types")
const { response } = require("express")

const sql = mysql.createConnection({host : "localhost",user : process.env.SQL_USER,password : process.env.SQL_PASSWORD,database : 'blog'})
const app = express()
const Port = 8081

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

sql.connect((err)=>{if(err) throw err; console.log("database connected")})
// sql.connect((err)=>{if(err) throw err;
//     sql.query(`SELECT Tag FROM posttag`,(err,result)=>{
//         if(err) throw err
//         console.log(result[0]['Tag'])
//     })
// }) 測試用


//type對照
//1 -> 日常瞎扯淡
//2 -> 心得分享
//3 -> 胡搞瞎搞
//4 -> 其他


app.post("/post",(req,res)=>{
    let ReadPostObject = {} 

    sql.query(`SELECT * FROM posts WHERE id = "${req.body.id}";`,(err,result)=>{
        if(err){
            console.log("failed to get post")
            return
        } 
        console.log(req.query.postid)
        console.log(result)
        ReadPostObject.postTitle = result[0]['Title']
        ReadPostObject.postID = result[0]['id']
        ReadPostObject.postDate = result[0]['PostDate']
        ReadPostObject.postType = result[0]['PostType']
        ReadPostObject.text = result[0]['ContentText']
    })
    // sql.query(`SELECT * FROM posttag WHERE id = ${req.query.postid}`,(err,result)=>{
    //     if(err) console.log("mission failed")
    //     ReadPostObject.postTag = result
    //     sql.query(`SELECT * FROM tags`,(err,result)=>{
    //         if(err) console.log("mission failed")
    //         TagList = result
    //         for(let i in TagList){
    //             console.log(TagList[i]['Tag']) //測試用
    //             console.log(ReadPostObject.postTag[i]) //測試用

    //             if(ReadPostObject.postTag[i]['Tag'].includes(TagList[i]['Tag'])){ 
    //                 ReadPostObject.postTag[i] = TagList[i]['TagName']
    //             }
    //             // for(let j in ReadPostObject.postTag){
    //             //     if(TagList[i]['tag'] in ReadPostObject.postTag[j]['Tag']){
    //             //         ReadPostObject.postTag[j] = TagList[i]['TagName']
    //             //     }
    //             // } //重作篩選機制，但會崩掉
    //         }
    //         res.json(ReadPostObject)
    //     })
    // })  //篩選機制有問題 會崩
    sql.query(`SELECT * FROM tags`,(err,result)=>{
        if(err){
            console.log("failed to get tag list")
            return
        } 
        TagList = result
        sql.query(`SELECT * FROM posttag WHERE id = "${req.body.id}";`,(err,result)=>{
            if(err){
                console.log("failed to get post tag")
                return
            } 
            ReadPostObject.postTag = result
            for(let i in TagList){
                for(let j in ReadPostObject.postTag){
                    if(TagList[i]['Tag'].includes(ReadPostObject.postTag[j]['Tag'])){
                        ReadPostObject.postTag[j] = TagList[i]['TagName']
                        break
                    }
                }
            }
            res.json(ReadPostObject)
        })
    }) //重寫篩選機制 暴力for 目前沒問題
}) //取得文章完整資訊

// app.get("/post/list",(req,res)=>{
//     let PostPreviewInfoList = []

//     // sql.query(`SELECT * FROM posts WHERE PostType = ${req.query.type}`,(err,result)=>{
//     //     if(err) console.log("mission failed")
//     //     for(let i in PostPreviewInfoObject){
//     //         PostPreviewInfoObject[].postID = result[i]['id']
//     //         PostPreviewInfoObject[i].Title = result[i]['Title']
//     //         PostPreviewInfoObject[i].postDate = result[i]['PostDate']
//     //         sql.query(`SELECT * FROM posttag WHERE id = ${PostPreviewInfoObject[i].Title}`,(err)=>{
//     //             if(err) console.log("mission failed")
//     //             PostPreviewInfoObject[i].postTag = result
//     //             sql.query(`SELECT * FROM tags`,(err,result)=>{
//     //                 if(err) console.log("mission failed")
//     //                 TagList = result
//     //                 for(let j in PostPreviewInfoObject.postTag){
//     //                     if(postList[i]['Tag'].includes(PostPreviewInfoObject.postTag[j]['Tag'])){
//     //                         PostPreviewInfoObject.postTag[j] = TagList[i]['TagName']
//     //                         break
//     //                     }
//     //                 }
//     //             })
//     //         })
//     //     }
//     // }) //初版，有障礙重寫一次
//     sql.query(`SELECT * FROM posts WHERE PostType = "${req.query.type}"`,(err,result)=>{
//         if(err){
//             console.log("failed to get post")
//             // console.log(`SELECT * FROM posts WHERE PostType = "${req.query.type}"`)   //測試用
//             return
//         }
//         // for(let i in result){
//         //     let PostObject = {}
//         //     PostObject.Title = result[i]['Title']
//         //     PostObject.postDate = result[i]['PostDate']
//         //     PostObject.postID = result[i]['id']
//         //     PostObject.text = result[i]['ContentText'].substring(0,80)
//         //     sql.query(`SELECT Tag FROM posttag WHERE id = "${PostObject.postID}"`,(err,result)=>{
//         //         if(err){
//         //             console.log("failed to get post tag")
//         //             // console.log(`SELECT Tag FROM posttag WHERE id = "${PostObject.postID}"`) //測試用
//         //             return
//         //         } 
//         //         PostObject.postTag = result
//         //         for(let j in result){
//         //             sql.query(`SELECT TagName FROM tags WHERE Tag = "${PostObject.postTag[j]['Tag']}"`,(err,result)=>{
//         //                 if(err){
//         //                     console.log("failed to tag list")
//         //                     console.log(`SELECT TagName FROM tags WHERE Tag = "${PostObject.postTag[j]['Tag']}"`) //測試用
//         //                 }
//         //                 PostObject.postTag[j] = result[0]['TagName']
//         //                 PostPreviewInfoList.push(PostObject)//篩選機制還是壞的
//         //                  //又到了res放哪好的環節
//         //             })
                    
//         //         }
                
//         //     })
//         // select TagName,posts.id,posttag.id,posttag.tag,tags.tag from posts,posttag,tags where (posts.id = posttag.id) and (posttag.tag = tags.tag); //一次全部來 v1
//         // }

        
//         res.json(PostPreviewInfoList)//會回傳空
//         console.log(PostPreviewInfoList) //測試用
//     })
// }) //取得文章列表處預覽資訊

app.get("/post/list",(req,res)=>{
    sql.query(`SELECT * FROM posts WHERE posts.PostType = "${req.query.type}";`,(err,result)=>{
        if(err) {
            console.log("failed to get list content")
            return
        }
        res.json(result)
    }) //一次全部來 v2  標籤會分開
})

app.get("/",(req,res)=>{
    // sql.query(`SELECT id from posts`,(err,result)=>{
    //     if(err) {
    //         console.log("failed to get post preview")
    //         return
    //     }
    //     let r = Math.floor(Math.random*result.lengh)
    //     // console.log(result) //測試用
    //     let id = result
        
    // })
    sql.query(`SELECT * FROM posts ORDER BY RAND() LIMIT 3;`,(err,result)=>{
        if(err) {
            console.log("failed to get post preview")
            return
        }
        console.log(result) //測試用
        res.json(result)
    })
    
}) //首頁那些

app.post('/writepost',(req,res)=>{
    let date = new Date()
    sql.query(`SELECT MAX(id) FROM posts;`,(err,result)=>{
        if(err){
            console.log("failed to get id")
            return
        }
        // console.log(result[0]['MAX(id)']) //測試用
        // console.log(`INSERT INTO posts VALUE ("${String(Number(result[0]['MAX(id)']) + 1).padStart(5,'0')}","${req.Title}","${String(date.getFullYear()) + "/" + String(date.getMonth()) + "/" + String(date.getDate())}","${req.type}","${req.text}")`) //測試用
        sql.query(`INSERT INTO posts VALUE ("${String(Number(result[0]['MAX(id)']) + 1).padStart(5,'0')}","${req.body.postcontent.title}","${String(date.getFullYear()) + "/" + String(date.getMonth()+1).padStart(2,'0') + "/" + String(date.getDate()).padStart(2,'0')}","${req.body.postcontent.type}","${req.body.postcontent.ctx}")`,(err,result)=>{
            if(err){
                console.log('failled to insert post')
                return
            }
            // sql.query(`SELECT * FROM tags;`,(err,result)=>{
            //     if(err){
            //         console.log('failed to get tags')
            //         return
            //     }
            //     for(let i in result){
            //         for(let j in req.postcontent.tags){
            //             if(req.postcontent.tags[j] = result[i]['TagName']){
            //                 break
            //             }
            //         }
            //     }
            // })  卡住了

            for(let i in req.body.postcontent.tags){
                sql.query(`INSERT INTO tags VALUE ("${req.body.postcontent.tags[i]}","${req.body.postcontent.tags[i]}");`,(err,result)=>{
                    if(err){
                        console.log('failed to add new tag')
                    }
                    sql.query(`SELECT MAX(id) FROM posts;`,(err,result)=>{
                        if(err){
                            console.log('failed to get id')
                        }
                        sql.query(`INSERT INTO posttag VALUE ("${result[0]['MAX(id)']}","${req.body.postcontent.tags[i]}");`,(err)=>{
                            if(err){
                                console.log('failed to add post tag')
                            }
                        })
                    })
                })
            }
        })
        res.json({'msg': 'Success'})
    })
})//寫文章

app.get('/edit/:id',(req,res)=>{
    sql.query(`SELECT posts.*,posttag.tag,tags.TagName FROM posts,posttag,tags WHERE (posts.id = posttag.id) AND (posts.id = "${req.params.id}") AND (posttag.tag = tags.tag)`,(err,result)=>{
        if(err){
            // console.log(req.params.id) //測試用
            console.log('failed to get content')
            // console.log(err) //測試用
            return
        }
        res.json(result)
        // console.log(req.params.id) //測試用
    })
})//改文章讀取

app.post('/editpost',(req,res)=>{
    sql.query(`UPDATE posts SET id = "${req.body.postid}" , Title = "${req.body.postcontent.title}" , PostType = "${req.body.postcontent.type}" , ContentText = "${req.body.postcontent.ctx}" WHERE id = "${req.body.postid}";`,(err,result)=>{
        if(err){
            console.log('failed to edit post content')
            return
        }
        sql.query(`DELETE FROM posttag WHERE id = "${req.body.postid}";`,(err,result)=>{
            if(err){
                console.log('failed to clear old tags')
            }
            for(let i in req.body.postcontent.tags){
                sql.query(`INSERT INTO tags VALUE ("${req.body.postcontent.tags[i]}","${req.body.postcontent.tags[i]}");`,(err,result)=>{
                    if(err){
                        console.log('failed to add new tag,there might already have the tag or it get error')
                    }
                        sql.query(`INSERT INTO posttag VALUE ("${req.body.postid}","${req.body.postcontent.tags[i]}");`,(err)=>{
                            if(err){
                                console.log('failed to add tag to post')
                                return
                            }
                        })
                })
            }
        })
    })

})//改文章

app.post('/login',(req,res)=>{
    if(req.body.password === process.env.OWNER_PASSWORD){
        res.json({'user':'owner'})
    }
    else{
        res.json({'msg':'wrong password'})
    }
})//登入

app.post('/getTag',(req,res)=>{
    sql.query(`SELECT posttag.tag,tags.TagName FROM posttag,tags WHERE (posttag.id = "${req.body.id}") AND (posttag.tag = tags.tag)`,(err,result)=>{
        if(err){
            console.log('failed to get post tags')
            return
        }
        res.json(result)
    })
})




app.listen(Port)

