require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mysql = require("mysql")

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


app.get("/post",(req,res)=>{
    let ReadPostObject = {} 

    sql.query(`SELECT * FROM posts WHERE id = "${req.query.postid}"`,(err,result)=>{
        if(err){
            console.log("failed to get post")
            return
        } 
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
        sql.query(`SELECT * FROM posttag WHERE id = "${req.query.postid}"`,(err,result)=>{
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
    sql.query(`select posts.*,posttag.tag,tags.tagname from posts,posttag,tags where (posts.id = posttag.id) AND (posttag.tag = tags.tag) AND (posts.PostType = "${req.query.type}");`,(err,result)=>{
        res.json(result)
    }) //一次全部來 v2  標籤會分開
})




app.listen(Port)

