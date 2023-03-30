/**
 *	Neon Notes Script
 *
 *	Developed by Arlind Nushi - www.laborator.co
 */

var neonNotes = neonNotes || {};
var noteID=0;

; (function ($, window, undefined) {
    //启用严格模式
    "use strict";

    $(document).ready(function () {
        neonNotes.$container = $(".notes-env");

        $.extend(neonNotes, {
            isPresent: neonNotes.$container.length > 0,

            noTitleText: "未定义",
            noDescriptionText: "",


            $currentNote: $(null),
            $currentNoteTitle: $(null),
            $currentNoteDescription: $(null),
            $currentNoteContent: $(null),
            //添加
            addNote: function () {
                var $note = $('<li><a href="#" id="0"><strong></strong><span></li></a></li>');

                $note.append('<div class="content"></div>').append('<button class="note-close">&times;</button>');

                $note.find('strong').html(neonNotes.noTitleText);
                $note.find('span').html(neonNotes.noDescriptionText);

                neonNotes.$notesList.prepend($note);

                TweenMax.set($note, { autoAlpha: 0 });

                var tl = new TimelineMax();

                tl.append(TweenMax.to($note, .10, { css: { autoAlpha: 1 } }));
                tl.append(TweenMax.to($note, .15, { css: { autoAlpha: .8 } }));
                tl.append(TweenMax.to($note, .15, { css: { autoAlpha: 1 } }));

                neonNotes.$notesList.find('li').removeClass('current');
                $note.addClass('current');

                neonNotes.$writePadTxt.focus();

                neonNotes.checkCurrentNote();
            },
            //取数据库
            addNoteForDB: function (title, sutitle, content, NoteID) {
                var $note = $('<li><a href="#" id="' + NoteID + '"><strong></strong><span></li></a></li>');

                $note.append('<div class="content"></div>').append('<button class="note-close">&times;</button>');

                $note.find('strong').html(title);
                $note.find('span').html(sutitle);


                neonNotes.$notesList.prepend($note);

                TweenMax.set($note, { autoAlpha: 0 });

                var tl = new TimelineMax();

                tl.append(TweenMax.to($note, .10, { css: { autoAlpha: 1 } }));
                tl.append(TweenMax.to($note, .15, { css: { autoAlpha: .8 } }));
                tl.append(TweenMax.to($note, .15, { css: { autoAlpha: 1 } }));

                neonNotes.$notesList.find('li').removeClass('current');
                $note.addClass('current');

                neonNotes.$writePadTxt.focus();

                neonNotes.checkCurrentNote();

                // neonNotes.$currentNoteContent.text(content);
                neonNotes.$currentNoteContent[0].innerHTML = content.replace(/<br>/g, "\n");

                var $current_note = neonNotes.$notesList.find('li.current').first();
                neonNotes.$notesList.find('li').removeClass('current');
                $current_note.addClass('current');
                neonNotes.checkCurrentNote();
            },
            //更新   
            updateNote: function (title, sutitle, content, id) {
				if(id==0)
				{
					 $.ajax({
						type: 'PUT',
						url: "/API/Note",
						dataType: "json",
						context: this,
						data: {  title: title, subtitle: sutitle,content: content },
						error: function (result) {
						},
						success: function (result) {
							neonNotes.getAllNotes();
						}
					});
				}
				else
				{
					//读取
					$.ajax({
						type: 'post',
						url: "/API/Note",
						dataType: "json",
						context: this,
						data: { id: id, title: title, subtitle: sutitle, content: content },
						error: function (result) {
						},
						success: function (result) {
						}
					});
				}
            },

            checkCurrentNote: function () {
                var $current_note = neonNotes.$notesList.find('li.current').first();

                if ($current_note.length) {
                    neonNotes.$currentNote = $current_note;
                    neonNotes.$currentNoteTitle = $current_note.find('strong');
                    neonNotes.$currentNoteDescription = $current_note.find('span');
                    neonNotes.$currentNoteContent = $current_note.find('.content');

                    neonNotes.$writePadTxt.val($.trim(neonNotes.$currentNoteContent.html())).trigger('autosize.resize');;
                }
                else {
                    var first = neonNotes.$notesList.find('li:first:not(.no-notes)');

                    if (first.length) {
                        first.addClass('current');
                        neonNotes.checkCurrentNote();
                    }
                    else {
                        neonNotes.$writePadTxt.val('');
                        neonNotes.$currentNote = $(null);
                        neonNotes.$currentNoteTitle = $(null);
                        neonNotes.$currentNoteDescription = $(null);
                        neonNotes.$currentNoteContent = $(null);
                    }
                }
            },
            getAllNotes: function () {
                //读取
                $.ajax({
                    type: 'get',
                    url: "/API/Note",
                    dataType: "json",
                    context: this,
                    error: function (result) {
                        alert("查询便签失败！");
                    },
                    success: function (result) {
                        var res = result.data;
                        //根据插入便签
						if(res.length>0)
						{
							neonNotes.$notesList.empty();
							for (var i = res.length-1; i>=0; i--) {
								neonNotes.addNoteForDB(res[i].title, res[i].subtitle, res[i].content, res[i].id);
							}
						}
						else
						{
							neonNotes.$notesList.empty();
							neonNotes.$notesList.html('<li class="no-notes">╮(╯▽╰)╭   好记性不如烂笔头!</li>');
						}
                    }
                });
            },
            //更新
            updateCurrentNoteText: function () {
                var text = $.trim(neonNotes.$writePadTxt.val());

                if (neonNotes.$currentNote.length) {
                    var title = '',
						description = '';

                    if (text.length) {
                        var _text = text.split("\n"), currline = 1;

                        for (var i = 0; i < _text.length; i++) {
                            if (_text[i]) {
                                if (currline == 1) {
                                    title = _text[i];
                                }
                                else
                                    if (currline == 2) {
                                        description = _text[i];
                                    }

                                currline++;
                            }

                            if (currline > 2)
                                break;
                        }
                    }
                   //
                    neonNotes.$currentNoteTitle.text(title.length ? title : neonNotes.noTitleText);
                    neonNotes.$currentNoteDescription.text(description.length ? description : neonNotes.noDescriptionText);
                    neonNotes.$currentNoteContent.text(text);
                    //
                    var NoteID = neonNotes.$currentNote.find('a')[0].getAttribute('ID');;
                    neonNotes.updateNote(title.length ? title : neonNotes.noTitleText, description.length ? description : neonNotes.noDescriptionText, text, NoteID);

                }
                else
                    if (text.length) {
                        neonNotes.addNote();
                    }
            }

        });

        // Mail Container Height fit with the document
        if (neonNotes.isPresent) {
            neonNotes.$notesList = neonNotes.$container.find('.list-of-notes');
            neonNotes.$writePad = neonNotes.$container.find('.write-pad');
            neonNotes.$writePadTxt = neonNotes.$writePad.find('textarea');

            neonNotes.$addNote = neonNotes.$container.find('#add-note');
			neonNotes.$saveNote = neonNotes.$container.find('#save-note');

            neonNotes.$addNote.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, function (ev) {
                neonNotes.addNote();
            });

			neonNotes.$saveNote.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, function (ev) {
               neonNotes.updateCurrentNoteText();
            });

			neonNotes.$writePadTxt.keydown(function (e) {
					if (e.keyCode == 13) {
						neonNotes.updateCurrentNoteText();
					}
			});

            neonNotes.getAllNotes();
            neonNotes.checkCurrentNote();

            neonNotes.$notesList.on(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, 'li a', function (ev) {
                ev.preventDefault();

                neonNotes.$notesList.find('li').removeClass('current');
                $(this).parent().addClass('current');

                neonNotes.checkCurrentNote();


            });
            //删除
            neonNotes.$notesList.on(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, 'li .note-close', function (ev) {
                ev.preventDefault();

                var $note = $(this).parent();
                var Cnoteid = $note.find('a')[0].getAttribute('ID');

                //删除
                $.ajax({
                    type: 'delete',
                    url: "/API/Note",
                    dataType: "json",
                    context: this,
                    data: { id: Cnoteid },
                    error: function (result) {
                        alert("查询便签失败！");
                    },
                    success: function (result) {
                        //根据删除便签
                        tl.append(
                            TweenMax.to($note, .15, {
                                css: { autoAlpha: 0.2 }, onComplete: function () {
                                    $note.slideUp('fast', function () {
                                        $note.remove();
                                        neonNotes.checkCurrentNote();
                                    });
                                }
                            })
                           );
                    }
                });

                var tl = new TimelineMax();


            });
        }


    });

})(jQuery, window);

